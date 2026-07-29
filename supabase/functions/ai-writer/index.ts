import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const PROMPTS: Record<string, (ctx: any) => { system: string; user: string }> = {
  rewrite: (c) => ({ system: "You are a professional editor. Rewrite text to be clearer, more engaging, and confident. Preserve meaning and formatting. Return only the rewritten text.", user: c.selection || c.body }),
  grammar: (c) => ({ system: "You are a copy editor. Fix grammar, spelling and punctuation only. Do not change tone. Return only the corrected text.", user: c.selection || c.body }),
  expand: (c) => ({ system: "You are a technical writer. Expand the text with helpful detail, examples and depth. Keep original voice. Return only the expanded text.", user: c.selection || c.body }),
  shorten: (c) => ({ system: "You are an editor. Tighten the text ~40% shorter. Return only the shortened text.", user: c.selection || c.body }),
  readability: (c) => ({ system: "Rewrite for 8th-grade readability. Short sentences, plain words, active voice. Return only the rewritten text.", user: c.selection || c.body }),
  summary: (c) => ({ system: "Write a single-paragraph TL;DR (2–3 sentences). Return only the summary.", user: c.body }),
  seo_title: (c) => ({ system: "Write an SEO title under 60 characters. Keyword-forward, no quotes. Return only the title.", user: `Post title: ${c.title}\n\nContent:\n${(c.body || "").slice(0, 3000)}` }),
  meta_description: (c) => ({ system: "Write a meta description 140–158 characters. Benefit-led, subtle CTA, no quotes. Return only the description.", user: `Post title: ${c.title}\n\nContent:\n${(c.body || "").slice(0, 3000)}` }),
  keywords: (c) => ({ system: "Suggest 5 focus keyword phrases, one per line, no numbering.", user: `Title: ${c.title}\n\nContent:\n${(c.body || "").slice(0, 3000)}` }),
  alt_text: (c) => ({ system: "Write a concise, descriptive image alt text under 125 characters.", user: `Context: ${c.title}\nExisting alt: ${c.lastImageAlt ?? "(none)"}\nExcerpt:\n${(c.body || "").slice(0, 1500)}` }),
  tone: (c) => ({ system: "Rewrite in a confident, professional, warm tone for business decision-makers. Return only the rewritten text.", user: c.selection || c.body }),
  continue: (c) => ({ system: "Continue writing naturally from where it left off. Match the voice. Write 2–4 paragraphs. Return only new content.", user: `Title: ${c.title}\n\nSo far:\n${c.body}` }),
};

// Fallback chain — swap models on failure without exposing raw errors.
const MODEL_CHAIN = [
  "google/gemini-3.6-flash",
  "google/gemini-2.5-flash",
  "openai/gpt-5-mini",
];

async function callModel(model: string, key: string, system: string, user: string, signal: AbortSignal) {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    signal,
    headers: { "Content-Type": "application/json", "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "fetch" },
    body: JSON.stringify({
      model,
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
    }),
  });
  return res;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const key = Deno.env.get("LOVABLE_API_KEY");
    if (!key) return new Response(JSON.stringify({ error: "AI unavailable" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const body = await req.json();
    const action = String(body.action ?? "");
    const builder = PROMPTS[action];
    if (!builder) return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { system, user } = builder(body);

    let lastReason = "unknown";
    for (const model of MODEL_CHAIN) {
      const ctrl = new AbortController();
      const timeout = setTimeout(() => ctrl.abort(), 25000);
      try {
        const res = await callModel(model, key, system, user, ctrl.signal);
        clearTimeout(timeout);

        if (res.ok) {
          const data = await res.json();
          const text = data?.choices?.[0]?.message?.content ?? "";
          if (text.trim()) return new Response(JSON.stringify({ text, model }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
          lastReason = `empty response from ${model}`;
          continue;
        }

        // Retryable statuses → try next model
        if (res.status === 429 || res.status === 402 || res.status >= 500) {
          lastReason = `model ${model} responded ${res.status}`;
          console.warn(`[ai-writer fallback] ${lastReason}`);
          continue;
        }

        // Non-retryable: still try next model as last resort
        const errText = await res.text();
        lastReason = `model ${model} error ${res.status}: ${errText.slice(0, 200)}`;
        console.warn(`[ai-writer fallback] ${lastReason}`);
        continue;
      } catch (err) {
        clearTimeout(timeout);
        lastReason = `model ${model} threw: ${(err as Error).message}`;
        console.warn(`[ai-writer fallback] ${lastReason}`);
        continue;
      }
    }

    console.error(`[ai-writer] all models failed. last=${lastReason}`);
    return new Response(JSON.stringify({ error: "The AI assistant is temporarily unavailable. Please try again in a moment." }), { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("[ai-writer] unexpected", e);
    return new Response(JSON.stringify({ error: "Something went wrong. Please try again." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
