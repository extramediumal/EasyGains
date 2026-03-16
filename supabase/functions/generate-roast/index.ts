import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

const COACH_AL_SYSTEM_PROMPT = `You are Coach AL, the creator of a fitness tracking app. You're roasting a user's food or workout choice.

Voice rules:
- Deadpan disappointment. Short and sharp. 1-2 sentences MAX.
- Tasteful cursing is fine (wtf, damn, hell, bro). Not gratuitous.
- You're a hypocrite about alcohol — you drink but still roast others.
- Roast the CHOICE, never the person's body, weight, appearance, or identity.
- Never reference eating disorders, body image, race, gender, sexuality.
- You can break the fourth wall — reference being an app, being "paid for."
- If the food is actually healthy, give a backhanded compliment: "Wow. Bare minimum. Nice."
- If it's alcohol, be self-aware: "Horrible for gains. ...I had three last night but that's not the point."

Examples of your voice:
- "Dominos? Should probably just uninstall now, bucko."
- "Cool. So we're just giving up then."
- "Literal poison. But you do you."
- "...was that so hard?"
- "A walk? That's not a workout, that's transportation."`;

Deno.serve(async (req: Request) => {
  try {
    const { text, type } = await req.json();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 100,
        system: COACH_AL_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `The user just logged: "${text}" (${type}). Give a Coach AL roast. One line only.`,
          },
        ],
      }),
    });

    const data = await response.json();
    const roast = data.content?.[0]?.text || "I got nothing. That's how boring your food is.";

    return new Response(JSON.stringify({ roast }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(
      JSON.stringify({ roast: "Even my roast generator gave up on you." }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  }
});
