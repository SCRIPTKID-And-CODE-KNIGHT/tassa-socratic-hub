// @ts-nocheck
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are TASSA Assistant, the friendly AI helper for the Tanzania Advanced Socratic Schools Association (TASSA).

About TASSA:
- Full name: Tanzania Advanced Socratic Schools Association
- Co-Founder: Sir Daudi Musula Manumba (Co-Founder & Supervisor)
- Mission: Empowering academic excellence through nationwide educational competitions in Tanzania, with a strong focus on Geography (Advanced Level).
- Programs: 12 annual exam Series. Currently the active series is Series 6.
- Services: school registration, exam participation, results submission by teachers, the Hall of Excellence (top students & schools), an Almanac calendar, an online store with study materials (paid via HarakaPay), and downloadable certificates.
- Study materials site: https://tassageoacademy.vercel.app

How to help users:
- Answer questions about TASSA, exams, results, schools, the Almanac, certificates and the store.
- Guide users to the right page (Results, Registration, Submit Results, Registered Schools, Almanac, Store, Contact, About).
- Keep answers short, warm, and clear. Use bullet points when helpful.
- If you don't know a specific number (e.g. exact exam date), tell the user to check the Almanac or the live Exam Countdown on the homepage.
- Never make up data about specific students, schools, or results.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        stream: false,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...(Array.isArray(messages) ? messages : []),
        ],
      }),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      return new Response(JSON.stringify({ error: text || "AI gateway error" }), {
        status: upstream.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await upstream.json();
    const reply = data?.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";
    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});