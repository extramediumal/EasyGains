import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const CLAUDE_API_KEY = Deno.env.get("CLAUDE_API_KEY")!;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a chill fitness buddy inside a workout tracking app called EasyGains. Your job is to interpret what the user did for exercise and estimate effort.

RULES:
- Estimate duration, calories burned, and assign an effort score (1-10)
- Be reasonably accurate but not obsessively precise. Good enough for tracking.
- If the user is vague (e.g. "worked out"), ask ONE clarifying question with 3-4 multiple choice options
- Always respond in valid JSON format only, no markdown

EFFORT SCORE SCALE:
1-2: Light movement (short walk, stretching)
3-4: Moderate (brisk walk, light yoga, housework)
5-6: Solid workout (jogging, moderate lifting, swimming)
7-8: Hard workout (heavy deadlifts, HIIT, long run)
9-10: Max effort (competition, PRs, grueling session)

WORKOUT TYPES: strength, cardio, flexibility, sports, other

When you can estimate the workout, respond with:
{"type":"workout","workout_type":"cardio","exercises":[{"name":"Exercise name","detail":"Description","duration_min":30,"calories_burned":300,"effort_score":6}]}

When you need clarification, respond with:
{"type":"clarification","question":"Your question here","options":["Option 1","Option 2","Option 3"]}

Choose the best workout_type for the overall session. If mixed, pick the dominant one.
Calories burned should be realistic — a 30min jog is about 250-350 cal, a 60min lifting session is about 200-400 cal.
Effort score is the most important metric — be thoughtful about it.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const { text, context } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: "Missing text field" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const messages: Array<{ role: string; content: string }> = [];
    if (context) {
      messages.push(...context);
    }
    messages.push({ role: "user", content: text });

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    const data = await response.json();
    let content = data.content[0].text;

    // Strip markdown code fences if present
    content = content.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();

    const parsed = JSON.parse(content);

    return new Response(JSON.stringify(parsed), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to parse workout", details: String(error) }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }
});
