 import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
 };
 
 serve(async (req) => {
   if (req.method === "OPTIONS") {
     return new Response(null, { headers: corsHeaders });
   }
 
   const GMAIL_CLIENT_ID = Deno.env.get("GMAIL_CLIENT_ID");
   
   if (!GMAIL_CLIENT_ID) {
     return new Response(JSON.stringify({ error: "GMAIL_CLIENT_ID not configured" }), {
       status: 500,
       headers: { ...corsHeaders, "Content-Type": "application/json" },
     });
   }
 
   const url = new URL(req.url);
   const redirectUri = `${url.origin}/functions/v1/gmail-callback`;
   
   const scopes = [
     "https://www.googleapis.com/auth/gmail.send",
     "https://www.googleapis.com/auth/userinfo.email"
   ].join(" ");
 
   const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
   authUrl.searchParams.set("client_id", GMAIL_CLIENT_ID);
   authUrl.searchParams.set("redirect_uri", redirectUri);
   authUrl.searchParams.set("response_type", "code");
   authUrl.searchParams.set("scope", scopes);
   authUrl.searchParams.set("access_type", "offline");
   authUrl.searchParams.set("prompt", "consent");
 
   return new Response(JSON.stringify({ 
     authUrl: authUrl.toString(),
     redirectUri 
   }), {
     headers: { ...corsHeaders, "Content-Type": "application/json" },
   });
 });