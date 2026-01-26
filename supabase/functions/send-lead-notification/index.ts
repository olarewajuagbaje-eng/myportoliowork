import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadNotificationRequest {
  name: string;
  email: string;
  message: string;
}

interface LeadAnalysis {
  category: string;
  intent: string;
  priority: "high" | "medium" | "low";
  suggestedResponse: string;
}

async function analyzeLeadWithAI(message: string): Promise<LeadAnalysis> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  
  if (!LOVABLE_API_KEY) {
    console.log("LOVABLE_API_KEY not configured, using default analysis");
    return {
      category: "General Inquiry",
      intent: "Exploring automation services",
      priority: "medium",
      suggestedResponse: "Follow up within 24 hours"
    };
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
            content: `You are a lead analysis assistant for an automation architect. Analyze the incoming lead message and categorize it.
            
Return a JSON object with:
- category: One of "E-commerce Automation", "CRM Sync", "AI Chatbot", "Email Automation", "Content Repurposing", "Executive Assistant", "Video Production", "Custom Integration", "General Inquiry"
- intent: A brief description of what the lead is looking for (max 50 words)
- priority: "high" (ready to buy, specific project), "medium" (interested, exploring), or "low" (just curious, vague request)
- suggestedResponse: A brief suggested action for follow-up (max 30 words)

Only respond with valid JSON, no markdown or extra text.`
          },
          {
            role: "user",
            content: `Analyze this lead message: "${message}"`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_lead",
              description: "Analyze and categorize the lead inquiry",
              parameters: {
                type: "object",
                properties: {
                  category: { 
                    type: "string", 
                    enum: ["E-commerce Automation", "CRM Sync", "AI Chatbot", "Email Automation", "Content Repurposing", "Executive Assistant", "Video Production", "Custom Integration", "General Inquiry"]
                  },
                  intent: { type: "string" },
                  priority: { type: "string", enum: ["high", "medium", "low"] },
                  suggestedResponse: { type: "string" }
                },
                required: ["category", "intent", "priority", "suggestedResponse"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "analyze_lead" } }
      }),
    });

    if (!response.ok) {
      console.error("AI Gateway error:", response.status);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      return JSON.parse(toolCall.function.arguments);
    }

    throw new Error("No tool call in response");
  } catch (error) {
    console.error("AI analysis error:", error);
    return {
      category: "General Inquiry",
      intent: "Exploring automation services",
      priority: "medium",
      suggestedResponse: "Follow up within 24 hours"
    };
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message }: LeadNotificationRequest = await req.json();

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      throw new Error("Email service not configured");
    }

    console.log("Processing lead notification via email...");

    // Analyze lead with AI
    console.log("Analyzing lead message with AI...");
    const analysis = await analyzeLeadWithAI(message);
    console.log("Lead analysis complete:", analysis);

    // Priority emoji and formatting
    const priorityEmoji = {
      high: "🔴",
      medium: "🟡",
      low: "🟢"
    }[analysis.priority];

    const priorityColor = {
      high: "#dc2626",
      medium: "#f59e0b",
      low: "#22c55e"
    }[analysis.priority];

    // Build email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #0a0a0a; color: #e5e5e5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #171717; border-radius: 12px; overflow: hidden; border: 1px solid #262626; }
          .header { background: linear-gradient(135deg, #8b5cf6, #10b981); padding: 24px; text-align: center; }
          .header h1 { margin: 0; color: white; font-size: 24px; }
          .priority-badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; background: ${priorityColor}; color: white; margin-top: 10px; }
          .content { padding: 24px; }
          .section { background: #262626; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
          .section-title { color: #8b5cf6; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 8px; }
          .section-content { color: #e5e5e5; }
          .label { color: #a3a3a3; font-size: 12px; }
          .value { color: #e5e5e5; font-size: 16px; font-weight: 500; }
          .ai-analysis { border-left: 3px solid #10b981; }
          .footer { padding: 16px 24px; background: #0a0a0a; text-align: center; font-size: 12px; color: #737373; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 New Lead Alert</h1>
            <div class="priority-badge">${analysis.priority.toUpperCase()} PRIORITY</div>
          </div>
          
          <div class="content">
            <div class="section">
              <div class="section-title">📧 Contact Details</div>
              <p><span class="label">Name:</span> <span class="value">${name}</span></p>
              <p><span class="label">Email:</span> <span class="value">${email}</span></p>
            </div>
            
            <div class="section">
              <div class="section-title">💬 Message</div>
              <p class="section-content">${message}</p>
            </div>
            
            <div class="section ai-analysis">
              <div class="section-title">🤖 AI Analysis</div>
              <p><span class="label">Category:</span> <span class="value">${analysis.category}</span></p>
              <p><span class="label">Intent:</span> <span class="value">${analysis.intent}</span></p>
              <p><span class="label">Suggested Action:</span> <span class="value">${analysis.suggestedResponse}</span></p>
            </div>
          </div>
          
          <div class="footer">
            Captured via Portfolio Command Center • ${new Date().toISOString()}
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email via Resend API
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio Leads <onboarding@resend.dev>",
        to: ["contact@agbaje.dev"],
        subject: `${priorityEmoji} New Lead: ${analysis.category} - ${name}`,
        html: emailHtml
      })
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Resend API error:", errorText);
      throw new Error("Failed to send email notification");
    }

    const emailData = await emailResponse.json();
    console.log("Email sent successfully:", emailData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Lead notification sent successfully",
        analysis: {
          category: analysis.category,
          priority: analysis.priority
        },
        steps: [
          { step: "ai_analysis", status: "success", message: `Lead categorized as ${analysis.category}` },
          { step: "email_dispatch", status: "success", message: "Secure mail dispatched to Agbaje" },
          { step: "routing", status: "success", message: `Priority: ${analysis.priority.toUpperCase()}` },
          { step: "system", status: "ready", message: "Automation standing by" }
        ]
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error in send-lead-notification:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        success: false,
        steps: [
          { step: "system", status: "error", message: errorMessage }
        ]
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
