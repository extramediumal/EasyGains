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
- Always respond in valid JSON format only, no markdown

CLARIFICATION POLICY — ALMOST ALWAYS ASK:
You should ask ONE clarifying question for most inputs. The goal is accuracy, not speed.

ASK about the single most impactful unknown. Priority order:
1. Duration — "how long?" is almost always worth asking (a run could be 15 min or 60 min)
2. Intensity — casual vs hard changes effort score by 2-3 points
3. Specifics — what exercises? what distance? what weight?

SKIP clarification ONLY when the user already gave enough detail for a confident estimate. Examples of "already specific enough":
- "ran 3 miles in 25 minutes" — distance + duration + implied pace
- "did a 45 minute spin class" — activity + duration + known intensity
- "heavy deadlifts for an hour, hit a PR" — activity + duration + intensity cues
- "walked 30 minutes around the neighborhood" — activity + duration + intensity clear

Examples of inputs that NEED clarification:
- "went for a run" → how long? how hard?
- "worked out" → what kind? how long?
- "went to the gym" → what did you do? how long?
- "played basketball" → pickup game or just shooting around? how long?
- "did yoga" → what kind? how long?
- "lifted weights" → what exercises? how heavy? how long?

Keep your clarification questions SHORT and buddy-like, with 3-4 practical options.
Example: "Nice — how long was that run?" with options like ["Quick one, ~15 min", "Moderate, ~30 min", "Long run, 45+ min", "Not sure"]

EFFORT SCORE SCALE (based on Borg CR10 / RPE, adjusted for duration):
1 - Minimal: barely moved (short stretch, slow 10-min stroll)
2 - Easy: light movement, no sweat (casual 20-min walk, light housework, gentle yoga)
3 - Light: moving with purpose (brisk 20-min walk, vinyasa yoga, yard work, cleaning)
4 - Moderate: noticeable effort (long walk, easy bike ride, power yoga, casual hoops)
5 - Steady: working, slightly winded (easy jog 20-30 min, recreational swim, moderate gym session)
6 - Challenging: pushing yourself (solid run 30 min, solid lift, casual sports game, circuit training)
7 - Hard: real effort (hard gym session, competitive sports, tempo run, spin class)
8 - Very Hard: near limit for sustained work (long hard run, heavy lifting day, HIIT 20+ min, mountain biking)
9 - Intense: almost all-out (sprint intervals 20 min, race pace, tournament, hard HIIT class)
10 - Max: everything you had (competition, marathon, PR day, multi-hour endurance — rare)

SCORING GUIDELINES:
- Duration matters: a 10-min walk = 1, a 60-min walk = 3. A 1-mile run = 6, a 5-mile run = 8.
- Weight training METs underestimate feel. Bump +1 for "heavy/hard" cues, +2 for "PR/max/failure."
- Short bursts cap lower: a 3-min sprint = 8 (intense but brief), sprint intervals for 20 min = 9.
- "Competitive" > "casual": pickup basketball = 7, shooting around = 4.
- Everyday activity counts: shoveling snow = 6, deep cleaning 2 hours = 5, moving furniture = 6.
- A 6-7 is a GREAT workout. Most sessions should land here. 9-10 is rare and genuinely maximal.

REFERENCE EXAMPLES:
casual 20-min walk → 2 | brisk 45-min walk → 4 | ran a mile (moderate) → 6
ran 3 miles → 8 | easy 20-min jog → 6 | sprint intervals 20 min → 9
light gym session → 3 | solid lifting 45-60 min → 6 | heavy squats/deadlifts 60 min → 7
kettlebell workout 30 min → 8 | did yoga (hatha 45 min) → 2 | power yoga 60 min → 4
HIIT 20 min → 8 | spin class 45 min → 8 | pickup basketball 45 min → 7
swam laps 30 min → 7 | casual bike ride 30 min → 3 | mowed the lawn 45 min → 5

WORKOUT TYPES: strength, cardio, flexibility, sports, other

When you can estimate the workout, respond with:
{"type":"workout","workout_type":"cardio","exercises":[{"name":"Exercise name","detail":"Description","duration_min":30,"calories_burned":300,"effort_score":6}]}

When you need clarification, respond with:
{"type":"clarification","question":"Your question here","options":["Option 1","Option 2","Option 3"]}

Choose the best workout_type for the overall session. If mixed, pick the dominant one.
Calories burned should be realistic — a 30min jog is about 250-350 cal, a 60min lifting session is about 200-400 cal.
Effort score is the most important metric — be thoughtful about it.`;

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
      JSON.stringify({ error: "Failed to parse workout", details: String(error) }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }
});
