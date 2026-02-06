import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AutoReplyRequest {
  leadId: string;
  name: string;
  email: string;
  message: string;
  category: string;
  intent: string;
}

async function getGmailAccessToken(): Promise<string> {
  const clientId = Deno.env.get("GMAIL_CLIENT_ID");
  const clientSecret = Deno.env.get("GMAIL_CLIENT_SECRET");
  const refreshToken = Deno.env.get("GMAIL_REFRESH_TOKEN");

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Gmail OAuth credentials not configured");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error("Token refresh error:", data);
    throw new Error(`Failed to refresh token: ${data.error_description || data.error}`);
  }

  return data.access_token;
}

async function generateAutoReply(name: string, message: string, category: string, intent: string): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  
  if (!LOVABLE_API_KEY) {
    console.log("LOVABLE_API_KEY not configured, using template response");
    return getTemplateResponse(name, category);
  }

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are Olarewaju Agbaje's professional AI assistant responding to portfolio inquiries. 
            
Write a warm, professional, and human-like email reply. Key guidelines:
- Be friendly and appreciative of their interest
- Acknowledge their specific inquiry naturally
- Mention that Olarewaju will personally review and respond soon
- Keep it concise (3-4 short paragraphs max)
- Sign off as "Olarewaju's AI Assistant"
- Do NOT use overly formal language or corporate jargon
- Sound genuinely helpful, not robotic

Category: ${category}
Their intent: ${intent}`
          },
          {
            role: "user",
            content: `Write a reply to ${name} who sent this message: "${message}"`
          }
        ],
      }),
    });

    if (!response.ok) {
      console.error("AI Gateway error:", response.status);
      throw new Error("AI generation failed");
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || getTemplateResponse(name, category);
  } catch (error) {
    console.error("AI generation error:", error);
    return getTemplateResponse(name, category);
  }
}

function getTemplateResponse(name: string, category: string): string {
  return `Hi ${name},

Thank you so much for reaching out! I really appreciate your interest in my ${category.toLowerCase()} services.

I've received your message and will personally review it shortly. You can expect a detailed response from me within 24-48 hours.

In the meantime, feel free to explore more of my work on the portfolio site.

Looking forward to connecting!

Best regards,
Olarewaju's AI Assistant`;
}

async function sendGmailReply(accessToken: string, to: string, subject: string, body: string): Promise<void> {
  const fromEmail = "olarewajuagbaje@gmail.com";
  
  const emailContent = [
    `From: Olarewaju Agbaje <${fromEmail}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `Content-Type: text/html; charset=utf-8`,
    "",
    body.replace(/\n/g, "<br>")
  ].join("\r\n");

  const encodedEmail = btoa(unescape(encodeURIComponent(emailContent)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw: encodedEmail }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Gmail send error:", errorData);
    throw new Error(`Failed to send email: ${response.status}`);
  }

  console.log("Email sent successfully via Gmail");
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { leadId, name, email, message, category, intent }: AutoReplyRequest = await req.json();

    console.log(`Processing auto-reply for lead ${leadId} to ${email}`);

    // Get Gmail access token
    console.log("Refreshing Gmail access token...");
    const accessToken = await getGmailAccessToken();

    // Generate AI-powered reply
    console.log("Generating AI-powered reply...");
    const replyContent = await generateAutoReply(name, message, category, intent);

    // Send via Gmail
    console.log("Sending email via Gmail...");
    await sendGmailReply(
      accessToken,
      email,
      `Re: Your Inquiry - ${category}`,
      replyContent
    );

    // Update lead in database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase
      .from("leads")
      .update({
        auto_reply_sent: true,
        auto_reply_sent_at: new Date().toISOString(),
        auto_reply_message: replyContent,
      })
      .eq("id", leadId);

    console.log(`Auto-reply sent successfully to ${email}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Auto-reply sent successfully",
        replyPreview: replyContent.substring(0, 200) + "..."
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error in send-auto-reply:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage, success: false }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
