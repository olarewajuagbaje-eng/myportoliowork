import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const PROMPTS: Record<string, (ctx: any) => { system: string; user: string }> = {
  rewrite: (c) => ({
    system: "You are a professional editor. Rewrite text to be clearer, more engaging, and confident. Preserve meaning and formatting. Return only the rewritten text, no preamble.",
    user: c.selection || c.body,
  }),
  grammar: (c) => ({
    system: "You are a copy editor. Fix grammar, spelling and punctuation only. Do not change tone or add content. Return only the corrected text.",
    user: c.selection || c.body,
  }),
  expand: (c) => ({
    system: "You are a technical writer. Expand the text with helpful detail, examples and depth. Keep the original voice. Return only the expanded text.",
    user: c.selection || c.body,
  }),
  shorten: (c) => ({
    system: "You are an editor. Tighten the text — cut filler, keep the point. Aim for ~40% shorter. Return only the shortened text.",
    user: c.selection || c.body,
  }),
  readability: (c) => ({
    system: "Rewrite for readability at 8th-grade level. Short sentences, plain words, active voice. Return only the rewritten text.",
    user: c.selection || c.body,
  }),
  summary: (c) => ({
    system: "Write a single-paragraph TL;DR summary (2–3 sentences) capturing the key takeaway. Return only the summary.",
    user: c.body,
  }),
  seo_title: (c) => ({
    system: "Write an SEO title under 60 characters. Keyword-forward, benefit-oriented, no quotes, no emoji. Return only the title.",
    user: `Post title: ${c.title}\n\nContent:\n${(c.body || "").slice(0, 3000)}`,
  }),
  meta_description: (c) => ({
    system: "Write a meta description 140–158 characters. Benefit-led, includes a subtle CTA, no quotes. Return only the description.",
    user: `Post title: ${c.title}\n\nContent:\n${(c.body || "").slice(0, 3000)}`,
  }),
  keywords: (c) => ({
    system: "Suggest 5 focus keyword phrases (2–4 words each), one per line, no numbering, no explanations.",
    user: `Title: ${c.title}\n\nContent:\n${(c.body || "").slice(0, 3000)}`,
  }),
  alt_text: (c) => ({
    system: "Write a concise, descriptive image alt text (under 125 characters) for accessibility. Describe what is shown, not that it is an image. Return only the alt text.",
    user: `Context: ${c.title}\nExisting alt (if any): ${c.lastImageAlt ?? "(none)"}\nArticle excerpt:\n${(c.body || "").slice(0, 1500)}`,
  }),
  tone: (c) => ({
    system: "Rewrite in a confident, professional, warm tone suited for business decision-makers. Avoid jargon. Return only the rewritten text.",
    user: c.selection || c.body,
  }),
  continue: (c) => ({
    system: "Continue writing the article naturally from where it left off. Match the voice and formatting. Write 2–4 paragraphs. Return only the new content.",
    user: `Title: ${c.title}\n\nSo far:\n${c.body}`,
  }),
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const key = Deno.env.get("LOVABLE_API_KEY");
    if (!key) return new Response(JSON.stringify({ error: "LOVABLE_API_KEY missing" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const body = await req.json();
    const action = String(body.action ?? "");
    const builder = PROMPTS[action];
    if (!builder) return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { system, user } = builder(body);

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "fetch" },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        messages: [{ role: "system", content: system }, { role: "user", content: user }],
      }),
    });

    if (res.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (res.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in workspace billing." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!res.ok) {
      const t = await res.text();
      return new Response(JSON.stringify({ error: `AI error: ${t.slice(0, 300)}` }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content ?? "";
    return new Response(JSON.stringify({ text }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
