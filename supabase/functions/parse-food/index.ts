import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const CLAUDE_API_KEY = Deno.env.get("CLAUDE_API_KEY")!;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a practical nutritionist inside a calorie tracking app called EasyGains. Your job is to interpret what the user ate and estimate macros.

RULES:
- Estimate portions in everyday terms (a bowl, a plate, a handful), not grams
- Be reasonably accurate but not obsessively precise. Good enough for tracking.
- Always respond in valid JSON format only, no markdown
- Protein is the most important macro — be as accurate as you can with protein estimates.

CLARIFICATION POLICY — ALMOST ALWAYS ASK:
You should ask ONE clarifying question for most inputs. The goal is accuracy, not speed.

ASK about the single most impactful unknown. Priority order:
1. Portion size — "how much?" is almost always worth asking (a chicken breast could be 4oz or 8oz)
2. Preparation method — fried vs grilled vs baked changes calories dramatically
3. Key ingredients — dressing on a salad, oil used for cooking, toppings on a pizza

SKIP clarification ONLY when the user already gave enough detail for a confident estimate. Examples of "already specific enough":
- "2 scrambled eggs with a tablespoon of butter" — portion + method + fat source all specified
- "a medium banana" — portion specified, no ambiguity
- "6oz grilled chicken breast with a cup of rice" — everything specified
- "a grande oat milk latte from Starbucks" — standardized item

Examples of inputs that NEED clarification:
- "chicken" → how much? how was it cooked?
- "pasta" → what kind? sauce? how big a serving?
- "salad" → what's in it? dressing?
- "a sandwich" → what kind? bread type? condiments?
- "eggs" → how many? cooked how?
- "rice and beans" → how much of each?

Keep your clarification questions SHORT and buddy-like, with 3-4 practical options.
Example: "Nice — how big was that chicken breast?" with options like ["Small (4oz)", "Medium (6oz)", "Large (8oz)", "Not sure, probably medium"]

When you can estimate the food, respond with:
{"type":"meal","foods":[{"name":"Food name","portion":"Description","calories":0,"protein":0,"carbs":0,"fat":0}]}

When you need clarification, respond with:
{"type":"clarification","question":"Your question here","options":["Option 1","Option 2","Option 3"]}

Keep portions realistic. A chicken breast is about 6oz/170g cooked. A bowl of rice is about 1.5 cups cooked.`;

function extractJSON(text: string): unknown {
  // Try the whole string first
  try { return JSON.parse(text); } catch { /* fall through */ }

  // Find the first { and its matching }
  const start = text.indexOf('{');
  if (start === -1) throw new Error('No JSON object found in response');

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (escape) { escape = false; continue; }
    if (ch === '\\' && inString) { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{') depth++;
    if (ch === '}') {
      depth--;
      if (depth === 0) {
        return JSON.parse(text.substring(start, i + 1));
      }
    }
  }

  throw new Error('No valid JSON object found in response');
}

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

    if (!data.content || !data.content[0]?.text) {
      return new Response(
        JSON.stringify({ error: "API error", details: data.error?.message || JSON.stringify(data) }),
        { status: 502, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    let content = data.content[0].text;

    // Strip markdown code fences if present
    content = content.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();

    const parsed = extractJSON(content);

    return new Response(JSON.stringify(parsed), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to parse food", details: String(error) }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }
});
