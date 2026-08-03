import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SALT = Deno.env.get("ENGAGEMENT_SALT") ?? "phase2-salt";

// Columns safe to return to the browser (never edit_secret_hash / visitor_hash / author_email)
const PUBLIC_COMMENT_COLS =
  "id, post_id, parent_id, author_name, body, like_count, pinned, created_at, edited_at, status";

const svc = () => createClient(SUPABASE_URL, SERVICE_ROLE);

async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function visitorFingerprint(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("cf-connecting-ip") ||
    "0.0.0.0";
  const ua = req.headers.get("user-agent") ?? "";
  const day = new Date().toISOString().slice(0, 10);
  return sha256(`${SALT}|${ip}|${ua}|${day}`);
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const isUuid = (v: unknown): v is string => typeof v === "string" && UUID_RE.test(v);
const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 320;

/** Strip all markup + control characters — comments are rendered as plain text. */
function sanitizeText(input: unknown, max: number): string {
  return String(input ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .trim()
    .slice(0, max);
}

/** In-memory sliding-window limiter (per isolate) for cheap abuse protection. */
const hits = new Map<string, number[]>();
function rateLimited(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(key, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > limit;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let visitor = "unknown";
  try {
    const payloadRaw = await req.json().catch(() => null);
    if (!payloadRaw || typeof payloadRaw !== "object") return json({ error: "Invalid request." }, 400);
    const { action, ...payload } = payloadRaw as Record<string, unknown>;
    visitor = await visitorFingerprint(req);

    if (rateLimited(`all:${visitor}`, 60, 60_000)) {
      return json({ error: "Too many requests. Please slow down." }, 429);
    }

    const sb = svc();

    if (action === "like_post") {
      const post_id = payload.post_id;
      if (!isUuid(post_id)) return json({ error: "Invalid request." }, 400);
      if (rateLimited(`like:${visitor}`, 20, 60_000)) return json({ error: "Too many requests." }, 429);
      const { data: existing } = await sb.from("post_likes").select("id").eq("post_id", post_id).eq("visitor_hash", visitor).maybeSingle();
      if (existing) await sb.from("post_likes").delete().eq("id", existing.id);
      else await sb.from("post_likes").insert({ post_id, visitor_hash: visitor });
      const { count } = await sb.from("post_likes").select("id", { count: "exact", head: true }).eq("post_id", post_id);
      return json({ liked: !existing, count: count ?? 0 });
    }

    if (action === "post_stats") {
      const post_id = payload.post_id;
      if (!isUuid(post_id)) return json({ error: "Invalid request." }, 400);
      const [{ count: likes }, { data: mine }] = await Promise.all([
        sb.from("post_likes").select("id", { count: "exact", head: true }).eq("post_id", post_id),
        sb.from("post_likes").select("id").eq("post_id", post_id).eq("visitor_hash", visitor).maybeSingle(),
      ]);
      return json({ likes: likes ?? 0, liked: !!mine });
    }

    if (action === "like_comment") {
      const comment_id = payload.comment_id;
      if (!isUuid(comment_id)) return json({ error: "Invalid request." }, 400);
      if (rateLimited(`clike:${visitor}`, 30, 60_000)) return json({ error: "Too many requests." }, 429);
      const { data: existing } = await sb.from("comment_likes").select("id").eq("comment_id", comment_id).eq("visitor_hash", visitor).maybeSingle();
      let delta = 1;
      if (existing) { await sb.from("comment_likes").delete().eq("id", existing.id); delta = -1; }
      else { await sb.from("comment_likes").insert({ comment_id, visitor_hash: visitor }); }
      const { data } = await sb.rpc("bump_comment_like_count", { _comment_id: comment_id, _delta: delta });
      return json({ liked: !existing, count: data ?? 0 });
    }

    if (action === "add_comment") {
      const { post_id, parent_id, honeypot } = payload as Record<string, unknown>;
      if (honeypot) return json({ ok: true }); // silent drop
      if (!isUuid(post_id)) return json({ error: "Invalid request." }, 400);
      if (parent_id != null && !isUuid(parent_id)) return json({ error: "Invalid request." }, 400);

      const name = sanitizeText(payload.name, 80);
      const body = sanitizeText(payload.body, 4000);
      const email = sanitizeText(payload.email, 320);
      if (!name || body.length < 2) return json({ error: "Please add your name and a comment." }, 400);
      if (email && !isValidEmail(email)) return json({ error: "Please enter a valid email address." }, 400);
      if (rateLimited(`cmt:${visitor}`, 3, 60_000)) return json({ error: "Slow down — try again shortly." }, 429);

      // Only allow comments on published posts
      const { data: post } = await sb.from("posts").select("id").eq("id", post_id).eq("status", "published").maybeSingle();
      if (!post) return json({ error: "Comments are closed for this article." }, 400);

      const hourAgo = new Date(Date.now() - 3600_000).toISOString();
      const { count: recent } = await sb.from("comments").select("id", { count: "exact", head: true }).eq("visitor_hash", visitor).gte("created_at", hourAgo);
      if ((recent ?? 0) >= 5) return json({ error: "Slow down — try again shortly." }, 429);

      const editSecret = crypto.randomUUID();
      const editHash = await sha256(editSecret);
      const { data, error } = await sb.from("comments").insert({
        post_id, parent_id: parent_id ?? null, author_name: name,
        author_email: email || null, body,
        status: "approved", edit_secret_hash: editHash, visitor_hash: visitor,
      }).select(PUBLIC_COMMENT_COLS).single();
      if (error) {
        console.error("[engagement] add_comment", error.message);
        return json({ error: "Couldn't post your comment. Please try again." }, 500);
      }
      return json({ comment: data, edit_secret: editSecret });
    }

    if (action === "edit_comment") {
      const { comment_id, edit_secret } = payload as Record<string, unknown>;
      if (!isUuid(comment_id)) return json({ error: "Invalid request." }, 400);
      const body = sanitizeText(payload.body, 4000);
      if (body.length < 2) return json({ error: "Comment is too short." }, 400);
      const { data: c } = await sb.from("comments").select("created_at, edit_secret_hash").eq("id", comment_id).maybeSingle();
      if (!c) return json({ error: "Comment not found." }, 404);
      if (Date.now() - new Date(c.created_at).getTime() > 15 * 60_000) return json({ error: "The 15-minute edit window has passed." }, 403);
      if ((await sha256(String(edit_secret ?? ""))) !== c.edit_secret_hash) return json({ error: "Not allowed." }, 403);
      const { data, error } = await sb.from("comments")
        .update({ body, edited_at: new Date().toISOString() })
        .eq("id", comment_id).select(PUBLIC_COMMENT_COLS).single();
      if (error) {
        console.error("[engagement] edit_comment", error.message);
        return json({ error: "Couldn't save your edit. Please try again." }, 500);
      }
      return json({ comment: data });
    }

    if (action === "delete_comment") {
      const { comment_id, edit_secret } = payload as Record<string, unknown>;
      if (!isUuid(comment_id)) return json({ error: "Invalid request." }, 400);
      const { data: c } = await sb.from("comments").select("edit_secret_hash").eq("id", comment_id).maybeSingle();
      if (!c) return json({ error: "Comment not found." }, 404);
      if ((await sha256(String(edit_secret ?? ""))) !== c.edit_secret_hash) return json({ error: "Not allowed." }, 403);
      await sb.from("comments").delete().eq("id", comment_id);
      return json({ ok: true });
    }

    return json({ error: "Unsupported action." }, 400);
  } catch (e) {
    console.error("[engagement] unexpected", e);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
});
