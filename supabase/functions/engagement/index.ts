import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SALT = Deno.env.get("ENGAGEMENT_SALT") ?? "phase2-salt";

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

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 320;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { action, ...payload } = await req.json();
    const sb = svc();
    const visitor = await visitorFingerprint(req);

    if (action === "like_post") {
      const { post_id } = payload;
      if (!post_id) return json({ error: "post_id required" }, 400);
      const { data: existing } = await sb.from("post_likes").select("id").eq("post_id", post_id).eq("visitor_hash", visitor).maybeSingle();
      if (existing) {
        await sb.from("post_likes").delete().eq("id", existing.id);
      } else {
        await sb.from("post_likes").insert({ post_id, visitor_hash: visitor });
      }
      const { count } = await sb.from("post_likes").select("id", { count: "exact", head: true }).eq("post_id", post_id);
      return json({ liked: !existing, count: count ?? 0 });
    }

    if (action === "post_stats") {
      const { post_id } = payload;
      const [{ count: likes }, { data: mine }] = await Promise.all([
        sb.from("post_likes").select("id", { count: "exact", head: true }).eq("post_id", post_id),
        sb.from("post_likes").select("id").eq("post_id", post_id).eq("visitor_hash", visitor).maybeSingle(),
      ]);
      return json({ likes: likes ?? 0, liked: !!mine });
    }

    if (action === "like_comment") {
      const { comment_id } = payload;
      if (!comment_id) return json({ error: "comment_id required" }, 400);
      const { data: existing } = await sb.from("comment_likes").select("id").eq("comment_id", comment_id).eq("visitor_hash", visitor).maybeSingle();
      let delta = 1;
      if (existing) { await sb.from("comment_likes").delete().eq("id", existing.id); delta = -1; }
      else { await sb.from("comment_likes").insert({ comment_id, visitor_hash: visitor }); }
      const { data } = await sb.rpc("bump_comment_like_count", { _comment_id: comment_id, _delta: delta });
      return json({ liked: !existing, count: data ?? 0 });
    }

    if (action === "add_comment") {
      const { post_id, parent_id, name, email, body, honeypot } = payload;
      if (honeypot) return json({ ok: true }); // silent drop
      if (!post_id || !name?.trim() || !body?.trim()) return json({ error: "Missing fields" }, 400);
      if (email && !isValidEmail(email)) return json({ error: "Invalid email" }, 400);
      if (body.length > 4000 || name.length > 80) return json({ error: "Too long" }, 400);
      // basic rate limit: 5 comments/hour per visitor
      const hourAgo = new Date(Date.now() - 3600_000).toISOString();
      const { count: recent } = await sb.from("comments").select("id", { count: "exact", head: true }).eq("visitor_hash", visitor).gte("created_at", hourAgo);
      if ((recent ?? 0) >= 5) return json({ error: "Slow down — try again shortly." }, 429);

      const editSecret = crypto.randomUUID();
      const editHash = await sha256(editSecret);
      const { data, error } = await sb.from("comments").insert({
        post_id, parent_id: parent_id ?? null, author_name: name.trim(),
        author_email: email?.trim() || null, body: body.trim(),
        status: "approved", edit_secret_hash: editHash, visitor_hash: visitor,
      }).select("*").single();
      if (error) return json({ error: error.message }, 500);
      return json({ comment: data, edit_secret: editSecret });
    }

    if (action === "edit_comment") {
      const { comment_id, body, edit_secret } = payload;
      const { data: c } = await sb.from("comments").select("*").eq("id", comment_id).maybeSingle();
      if (!c) return json({ error: "Not found" }, 404);
      const age = Date.now() - new Date(c.created_at).getTime();
      if (age > 15 * 60_000) return json({ error: "Edit window expired" }, 403);
      const hash = await sha256(edit_secret ?? "");
      if (hash !== c.edit_secret_hash) return json({ error: "Not allowed" }, 403);
      const { data, error } = await sb.from("comments").update({ body: body.trim(), edited_at: new Date().toISOString() }).eq("id", comment_id).select("*").single();
      if (error) return json({ error: error.message }, 500);
      return json({ comment: data });
    }

    if (action === "delete_comment") {
      const { comment_id, edit_secret } = payload;
      const { data: c } = await sb.from("comments").select("edit_secret_hash").eq("id", comment_id).maybeSingle();
      if (!c) return json({ error: "Not found" }, 404);
      const hash = await sha256(edit_secret ?? "");
      if (hash !== c.edit_secret_hash) return json({ error: "Not allowed" }, 403);
      await sb.from("comments").delete().eq("id", comment_id);
      return json({ ok: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
