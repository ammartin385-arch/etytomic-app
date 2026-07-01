import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function getRequiredEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function safeReturnUrl(value: unknown) {
  const fallback = Deno.env.get("SITE_URL") || "https://etytomic.com";
  if (typeof value !== "string") return fallback;

  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.hostname !== "localhost") return fallback;
    return url.origin;
  } catch {
    return fallback;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const supabaseUrl = getRequiredEnv("SUPABASE_URL");
    const anonKey = getRequiredEnv("SUPABASE_ANON_KEY");
    const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
    const stripeSecretKey = getRequiredEnv("STRIPE_SECRET_KEY");
    const authorization = req.headers.get("Authorization") || "";

    if (!authorization.startsWith("Bearer ")) {
      return jsonResponse({ error: "Please log in before managing your subscription." }, 401);
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData.user) {
      return jsonResponse({ error: "Please log in before managing your subscription." }, 401);
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("stripe_customer_id, subscription_status")
      .eq("id", userData.user.id)
      .single();

    if (profileError) throw profileError;

    const stripeCustomerId = profile?.stripe_customer_id;
    if (!stripeCustomerId || typeof stripeCustomerId !== "string") {
      return jsonResponse({ error: "No active Stripe subscription was found for this account yet." }, 404);
    }

    const body = await req.json().catch(() => ({}));
    const returnUrl = safeReturnUrl(body.returnUrl);
    const form = new URLSearchParams({
      customer: stripeCustomerId,
      return_url: returnUrl,
    });

    const stripeResponse = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
    });

    const stripeData = await stripeResponse.json();
    if (!stripeResponse.ok) {
      console.error("Stripe customer portal session failed", stripeData);
      return jsonResponse({ error: "Unable to open subscription management right now." }, 500);
    }

    return jsonResponse({ url: stripeData.url });
  } catch (error) {
    console.error("Customer portal function failed", error);
    return jsonResponse({ error: "Unable to open subscription management right now." }, 500);
  }
});
