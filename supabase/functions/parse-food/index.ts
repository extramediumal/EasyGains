import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const CLAUDE_API_KEY = Deno.env.get("CLAUDE_API_KEY")!;

const SYSTEM_PROMPT = `You are a practical nutritionist inside a calorie tracking app called EasyGains. Your job is to interpret what the user ate and estimate macros.

RULES:
- Estimate portions in everyday terms (a bowl, a plate, a handful), not grams
- Be reasonably accurate but not obsessively precise. Good enough for tracking.
- If the user is vague (e.g. "pasta"), ask ONE clarifying question with 3-4 multiple choice options
- Always respond in JSON format

When you can estimate the food, respond with:
{
  "type": "meal",
  "foods": [
    { "name": "Food name", "portion": "Description", "calories": 0, "protein": 0, "carbs": 0, "fat": 0 }
  ]
}

When you need clarification, respond with:
{
  "type": "clarification",
  "question": "Your question here",
  "options": ["Option 1", "Option 2", "Option 3"]
}

Keep portions realistic. "A chicken breast" is about 6oz/170g cooked. "A bowl of rice" is about 1.5 cups cooked.
Protein is the most important macro — be as accurate as you can with protein estimates.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { text, context } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: "Missing text field" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Build messages - include context if this is a follow-up (clarification answer)
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
    const content = data.content[0].text;

    // Parse Claude's JSON response
    const parsed = JSON.parse(content);

    return new Response(JSON.stringify(parsed), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to parse food", details: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
