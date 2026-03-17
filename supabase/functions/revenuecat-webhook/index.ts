import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const REVENUECAT_WEBHOOK_SECRET = Deno.env.get('REVENUECAT_WEBHOOK_SECRET');

Deno.serve(async (req: Request) => {
  // Verify webhook auth if secret is configured
  if (REVENUECAT_WEBHOOK_SECRET) {
    const authHeader = req.headers.get('Authorization');
    if (authHeader !== `Bearer ${REVENUECAT_WEBHOOK_SECRET}`) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  try {
    const body = await req.json();
    const event = body.event;

    if (!event) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const appUserId = event.app_user_id;
    if (!appUserId) {
      return new Response(JSON.stringify({ ok: true, skipped: 'no app_user_id' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const grantEvents = [
      'INITIAL_PURCHASE',
      'RENEWAL',
      'PRODUCT_CHANGE',
      'UNCANCELLATION',
    ];

    const revokeEvents = [
      'EXPIRATION',
      'BILLING_ISSUE',
      'CANCELLATION',
    ];

    const eventType = event.type;
    let isPro: boolean | null = null;

    if (grantEvents.includes(eventType)) {
      isPro = true;
    } else if (revokeEvents.includes(eventType)) {
      isPro = false;
    }

    if (isPro !== null) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      await supabase
        .from('profiles')
        .update({ is_pro: isPro })
        .eq('id', appUserId);
    }

    return new Response(JSON.stringify({ ok: true, eventType, isPro }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
