import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

type StripeEvent = {
  id: string;
  type: string;
  data: {
    object: Record<string, unknown>;
  };
};

const encoder = new TextEncoder();

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function getSupabaseAdmin() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function parseStripeSignature(header: string | null) {
  const parts = (header || "").split(",");
  const timestamp = parts.find((part) => part.startsWith("t="))?.slice(2);
  const signatures = parts
    .filter((part) => part.startsWith("v1="))
    .map((part) => part.slice(3));

  return { timestamp, signatures };
}

function hexToBytes(hex: string) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

async function verifyStripeSignature(payload: string, signatureHeader: string | null, secret: string) {
  const { timestamp, signatures } = parseStripeSignature(signatureHeader);

  if (!timestamp || signatures.length === 0) {
    return false;
  }

  const signedPayload = `${timestamp}.${payload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, encoder.encode(signedPayload));
  const expected = new Uint8Array(digest);

  return signatures.some((signature) => {
    try {
      return timingSafeEqual(expected, hexToBytes(signature));
    } catch {
      return false;
    }
  });
}

function getString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function getNestedString(object: Record<string, unknown>, path: string[]) {
  let current: unknown = object;
  for (const key of path) {
    if (!current || typeof current !== "object") return null;
    current = (current as Record<string, unknown>)[key];
  }
  return getString(current);
}

async function activatePremiumFromCheckout(session: Record<string, unknown>) {
  const supabase = getSupabaseAdmin();
  const userId = getString(session.client_reference_id);
  const email =
    getNestedString(session, ["customer_details", "email"]) ||
    getString(session.customer_email);
  const stripeCustomerId = getString(session.customer);
  const stripeSubscriptionId = getString(session.subscription);

  const updates = {
    subscription_status: "active",
    stripe_customer_id: stripeCustomerId,
    stripe_subscription_id: stripeSubscriptionId,
    updated_at: new Date().toISOString(),
  };

  if (userId) {
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId);

    if (error) throw error;
    console.log("Activated Premium by user id", userId);
    return;
  }

  if (email) {
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("email", email);

    if (error) throw error;
    console.log("Activated Premium by email", email);
    return;
  }

  console.warn("Checkout completed without client_reference_id or email", session.id);
}

async function syncSubscriptionStatus(subscription: Record<string, unknown>) {
  const supabase = getSupabaseAdmin();
  const stripeCustomerId = getString(subscription.customer);
  const stripeSubscriptionId = getString(subscription.id);
  const stripeStatus = getString(subscription.status) || "unknown";
  const appStatus = ["active", "trialing"].includes(stripeStatus) ? "active" : stripeStatus;

  if (!stripeCustomerId && !stripeSubscriptionId) {
    console.warn("Subscription event missing customer/subscription id");
    return;
  }

  let query = supabase
    .from("profiles")
    .update({
      subscription_status: appStatus,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
      updated_at: new Date().toISOString(),
    });

  if (stripeSubscriptionId) {
    query = query.eq("stripe_subscription_id", stripeSubscriptionId);
  } else {
    query = query.eq("stripe_customer_id", stripeCustomerId);
  }

  const { error } = await query;
  if (error) throw error;

  console.log("Synced subscription status", stripeStatus, stripeSubscriptionId || stripeCustomerId);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return jsonResponse({ error: "Webhook not configured" }, 500);
  }

  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");
  const isValid = await verifyStripeSignature(payload, signature, webhookSecret);

  if (!isValid) {
    console.warn("Invalid Stripe webhook signature");
    return jsonResponse({ error: "Invalid signature" }, 400);
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(payload);
  } catch (error) {
    console.error("Invalid Stripe webhook JSON", error);
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  try {
    if (event.type === "checkout.session.completed") {
      await activatePremiumFromCheckout(event.data.object);
    }

    if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      await syncSubscriptionStatus(event.data.object);
    }

    return jsonResponse({ received: true });
  } catch (error) {
    console.error("Stripe webhook handler failed", error);
    return jsonResponse({ error: "Webhook handler failed" }, 500);
  }
});
