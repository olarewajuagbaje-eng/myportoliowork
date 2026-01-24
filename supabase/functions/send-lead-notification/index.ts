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
- category: One of "E-commerce Automation", "CRM Sync", "AI Chatbot", "Email Automation", "Content Repurposing", "Executive Assistant", "Custom Integration", "General Inquiry"
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
                    enum: ["E-commerce Automation", "CRM Sync", "AI Chatbot", "Email Automation", "Content Repurposing", "Executive Assistant", "Custom Integration", "General Inquiry"]
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

    const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error("Telegram credentials not configured");
    }

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

    // Send enhanced Telegram notification with AI analysis
    const telegramMessage = `🚀 *New Lead Alert* ${priorityEmoji}

👤 *Name:* ${name}
📧 *Email:* ${email}

💬 *Message:*
${message}

---
🤖 *AI Analysis:*
📂 *Category:* ${analysis.category}
🎯 *Intent:* ${analysis.intent}
⚡ *Priority:* ${analysis.priority.toUpperCase()}
💡 *Suggested Action:* ${analysis.suggestedResponse}

---
_Captured via Portfolio Command Center_
_${new Date().toISOString()}_`;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramMessage,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!telegramResponse.ok) {
      const errorText = await telegramResponse.text();
      console.error("Telegram API error:", errorText);
      throw new Error("Failed to send Telegram notification");
    }

    console.log("Lead notification sent successfully:", { name, email, category: analysis.category, priority: analysis.priority });

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
          { step: "telegram", status: "success", message: "High-priority alert sent to Agbaje" },
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
