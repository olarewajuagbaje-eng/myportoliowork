import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ALLOWED_EMAIL = "olarewajuagbaje@gmail.com";

const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

async function adminExists(): Promise<boolean> {
  const { count, error } = await admin
    .from("user_roles")
    .select("*", { count: "exact", head: true })
    .eq("role", "admin");
  if (error) throw error;
  return (count ?? 0) > 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const action = body?.action;

    if (action === "check") {
      const exists = await adminExists();
      return new Response(JSON.stringify({ available: !exists }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "create") {
      if (await adminExists()) {
        return new Response(JSON.stringify({ error: "Admin already exists" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const email = String(body?.email ?? "").trim().toLowerCase();
      const password = String(body?.password ?? "");
      const displayName = String(body?.displayName ?? "").trim();

      if (email !== ALLOWED_EMAIL) {
        return new Response(JSON.stringify({ error: "Email not authorized for setup" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (password.length < 8) {
        return new Response(JSON.stringify({ error: "Password must be at least 8 characters" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Try to find existing auth user with that email
      let userId: string | null = null;
      const { data: list } = await admin.auth.admin.listUsers();
      const existing = list?.users?.find((u) => u.email?.toLowerCase() === email);

      if (existing) {
        userId = existing.id;
        await admin.auth.admin.updateUserById(userId, {
          password,
          email_confirm: true,
          user_metadata: { display_name: displayName || existing.user_metadata?.display_name },
        });
      } else {
        const { data: created, error: createErr } = await admin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { display_name: displayName },
        });
        if (createErr || !created.user) {
          return new Response(JSON.stringify({ error: createErr?.message ?? "Failed to create user" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        userId = created.user.id;
      }

      // Ensure profile exists
      await admin.from("profiles").upsert(
        { id: userId!, display_name: displayName || email.split("@")[0] },
        { onConflict: "id" }
      );

      // Assign admin role
      const { error: roleErr } = await admin
        .from("user_roles")
        .insert({ user_id: userId!, role: "admin" });
      if (roleErr && !String(roleErr.message).includes("duplicate")) {
        return new Response(JSON.stringify({ error: roleErr.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
