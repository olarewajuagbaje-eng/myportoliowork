 import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
 };
 
 serve(async (req) => {
   const url = new URL(req.url);
   const code = url.searchParams.get("code");
   const error = url.searchParams.get("error");
 
   if (error) {
     return new Response(`
       <html>
         <body style="font-family: system-ui; padding: 40px; background: #0a0a0a; color: #e5e5e5;">
           <h1 style="color: #ef4444;">Authorization Failed</h1>
           <p>Error: ${error}</p>
         </body>
       </html>
     `, { headers: { "Content-Type": "text/html" } });
   }
 
   if (!code) {
     return new Response(`
       <html>
         <body style="font-family: system-ui; padding: 40px; background: #0a0a0a; color: #e5e5e5;">
           <h1 style="color: #ef4444;">No Authorization Code</h1>
           <p>No code was provided in the callback.</p>
         </body>
       </html>
     `, { headers: { "Content-Type": "text/html" } });
   }
 
   const GMAIL_CLIENT_ID = Deno.env.get("GMAIL_CLIENT_ID");
   const GMAIL_CLIENT_SECRET = Deno.env.get("GMAIL_CLIENT_SECRET");
 
   if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET) {
     return new Response(`
       <html>
         <body style="font-family: system-ui; padding: 40px; background: #0a0a0a; color: #e5e5e5;">
           <h1 style="color: #ef4444;">Configuration Error</h1>
           <p>Gmail credentials not configured.</p>
         </body>
       </html>
     `, { headers: { "Content-Type": "text/html" } });
   }
 
   const redirectUri = `${url.origin}/functions/v1/gmail-callback`;
 
   try {
     // Exchange authorization code for tokens
     const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
       method: "POST",
       headers: { "Content-Type": "application/x-www-form-urlencoded" },
       body: new URLSearchParams({
         client_id: GMAIL_CLIENT_ID,
         client_secret: GMAIL_CLIENT_SECRET,
         code,
         grant_type: "authorization_code",
         redirect_uri: redirectUri,
       }),
     });
 
     const tokens = await tokenResponse.json();
 
     if (!tokenResponse.ok) {
       console.error("Token exchange error:", tokens);
       return new Response(`
         <html>
           <body style="font-family: system-ui; padding: 40px; background: #0a0a0a; color: #e5e5e5;">
             <h1 style="color: #ef4444;">Token Exchange Failed</h1>
             <p>Error: ${tokens.error_description || tokens.error}</p>
           </body>
         </html>
       `, { headers: { "Content-Type": "text/html" } });
     }
 
     console.log("Successfully obtained tokens");
 
     return new Response(`
       <html>
         <head>
           <style>
             body { font-family: system-ui; padding: 40px; background: #0a0a0a; color: #e5e5e5; }
             .container { max-width: 600px; margin: 0 auto; }
             h1 { color: #10b981; }
             .token-box { background: #171717; border: 1px solid #262626; border-radius: 8px; padding: 16px; margin: 16px 0; word-break: break-all; font-family: monospace; font-size: 12px; }
             .label { color: #8b5cf6; font-weight: bold; margin-bottom: 8px; }
             .warning { background: #422006; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin-top: 24px; }
           </style>
         </head>
         <body>
           <div class="container">
             <h1>✅ Gmail Authorization Successful!</h1>
             <p>Copy the refresh token below and add it as a secret named <strong>GMAIL_REFRESH_TOKEN</strong> in Lovable.</p>
             
             <div class="label">Refresh Token:</div>
             <div class="token-box">${tokens.refresh_token || "No refresh token returned (you may have already authorized this app before)"}</div>
             
             <div class="warning">
               <strong>⚠️ Important:</strong> Keep this token secure. It grants access to send emails from your Gmail account.
               ${!tokens.refresh_token ? "<br><br>If no refresh token appeared, you may need to revoke access at <a href='https://myaccount.google.com/permissions' style='color: #f59e0b;'>Google Account Permissions</a> and try again." : ""}
             </div>
           </div>
         </body>
       </html>
     `, { headers: { "Content-Type": "text/html" } });
 
   } catch (error) {
     console.error("Gmail callback error:", error);
     return new Response(`
       <html>
         <body style="font-family: system-ui; padding: 40px; background: #0a0a0a; color: #e5e5e5;">
           <h1 style="color: #ef4444;">Error</h1>
           <p>${error instanceof Error ? error.message : "Unknown error"}</p>
         </body>
       </html>
     `, { headers: { "Content-Type": "text/html" } });
   }
 });