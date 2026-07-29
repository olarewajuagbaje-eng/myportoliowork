import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_KEY = Deno.env.get("RESEND_API_KEY");
const SITE = "https://agbajeautomation.me";

const j = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { email, source } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return j({ error: "Valid email required" }, 400);
    const sb = createClient(SUPABASE_URL, SERVICE_ROLE);
    const token = crypto.randomUUID();

    // upsert pending
    const { data: existing } = await sb.from("newsletter_subscribers").select("*").eq("email", email).maybeSingle();
    if (existing?.status === "confirmed") return j({ ok: true, already: true });

    if (existing) {
      await sb.from("newsletter_subscribers").update({ status: "pending", confirm_token: token, source: source ?? existing.source }).eq("id", existing.id);
    } else {
      await sb.from("newsletter_subscribers").insert({ email, status: "pending", confirm_token: token, source: source ?? null });
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
        console.error("resend failed", err);
      }
    }
    return j({ ok: true });
  } catch (e) {
    return j({ error: (e as Error).message }, 500);
  }
});
