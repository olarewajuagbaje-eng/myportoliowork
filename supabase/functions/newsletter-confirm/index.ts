import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SITE = "https://agbajeautomation.me";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) return new Response("Missing token", { status: 400 });
  const sb = createClient(SUPABASE_URL, SERVICE_ROLE);
  const { data } = await sb.from("newsletter_subscribers").select("id").eq("confirm_token", token).maybeSingle();
  if (!data) return new Response("Invalid or expired token", { status: 404 });
  await sb.from("newsletter_subscribers").update({ status: "confirmed", confirmed_at: new Date().toISOString(), confirm_token: null }).eq("id", data.id);
  return new Response(
    `<!doctype html><html><head><meta charset="utf-8"><title>Subscription confirmed</title><meta http-equiv="refresh" content="3;url=${SITE}/blog"><style>body{background:#0a0a0b;color:#fff;font-family:Inter,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}.c{max-width:420px;padding:32px;text-align:center;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:20px;backdrop-filter:blur(20px)}h1{background:linear-gradient(90deg,#6366f1,#22d3ee);-webkit-background-clip:text;-webkit-text-fill-color:transparent}</style></head><body><div class="c"><h1>You're in.</h1><p>Redirecting you back to the blog…</p><a href="${SITE}/blog" style="color:#22d3ee">Go now →</a></div></body></html>`,
    { headers: { "Content-Type": "text/html" } }
  );
});
