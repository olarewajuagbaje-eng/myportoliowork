import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_KEY = Deno.env.get("RESEND_API_KEY");
const SITE = "https://agbajeautomation.me";

const j = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const hits = new Map<string, number[]>();
function rateLimited(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(key, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > limit;
}

const clean = (v: unknown, max: number) =>
  String(v ?? "").replace(/<[^>]*>/g, "").replace(/[\u0000-\u001F]/g, "").trim().slice(0, max);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return j({ error: "Method not allowed" }, 405);
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "0.0.0.0";
    if (rateLimited(ip, 5, 60_000)) return j({ error: "Too many requests. Please try again shortly." }, 429);

    const payload = await req.json().catch(() => null);
    if (!payload || typeof payload !== "object") return j({ error: "Invalid request." }, 400);

    const email = clean((payload as any).email, 320).toLowerCase();
    const source = clean((payload as any).source, 60) || null;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return j({ error: "Please enter a valid email address." }, 400);

    const sb = createClient(SUPABASE_URL, SERVICE_ROLE);
    const token = crypto.randomUUID();

    const { data: existing } = await sb.from("newsletter_subscribers").select("id, status, source").eq("email", email).maybeSingle();
    if (existing?.status === "confirmed") return j({ ok: true, already: true });

    if (existing) {
      await sb.from("newsletter_subscribers").update({ status: "pending", confirm_token: token, source: source ?? existing.source }).eq("id", existing.id);
    } else {
      await sb.from("newsletter_subscribers").insert({ email, status: "pending", confirm_token: token, source });
    }

    const confirmUrl = `${SUPABASE_URL}/functions/v1/newsletter-confirm?token=${token}`;
    if (RESEND_KEY) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_KEY}` },
          body: JSON.stringify({
            from: "Agbaje Olarewaju <onboarding@resend.dev>",
            to: [email],
            subject: "Confirm your subscription",
            html: `<div style="font-family:Inter,sans-serif;max-width:520px;margin:auto;padding:24px;background:#0a0a0b;color:#fff;border-radius:16px">
              <h2 style="margin:0 0 12px">One click to confirm</h2>
              <p style="color:#bbb">Thanks for subscribing to the Automation Journal. Confirm your email to start receiving field notes.</p>
              <p><a href="${confirmUrl}" style="display:inline-block;background:linear-gradient(90deg,#6366f1,#22d3ee);color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:600">Confirm subscription</a></p>
              <p style="color:#666;font-size:12px">If you didn't request this, ignore this email.</p>
              <p style="color:#444;font-size:12px">${SITE}</p>
            </div>`,
          }),
        });
      } catch (err) {
        console.error("[newsletter-subscribe] resend failed", err);
      }
    }
    return j({ ok: true });
  } catch (e) {
    console.error("[newsletter-subscribe] unexpected", e);
    return j({ error: "Something went wrong. Please try again." }, 500);
  }
});
