const FROM_EMAIL = Deno.env.get("REMINDER_FROM_EMAIL") || "Etytomic Alignment <reminders@etytomic.com>";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const APP_URL = (Deno.env.get("APP_URL") || "https://etytomic.com").replace(/\/$/, "");
const EMAIL_LOGO_URL = Deno.env.get("EMAIL_LOGO_URL") || `${APP_URL}/etytomic-email-logo.png`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const sendWelcomeEmail = async (email: string, displayName?: string) => {
  if (!RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY secret");
  }

  const safeName = escapeHtml((displayName || "").trim());
  const greeting = safeName ? `Hi ${safeName},` : "Welcome,";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: email,
      subject: "Your Etytomic Alignment account is ready",
      html: `
        <div style="font-family: Inter, Arial, sans-serif; color: #1f2937; line-height: 1.6; max-width: 560px; margin: 0 auto; padding: 24px;">
          <div style="text-align: center; margin: 0 0 24px;">
            <img src="${EMAIL_LOGO_URL}" alt="Etytomic Alignment" width="72" style="display: block; width: 72px; max-width: 72px; height: auto; margin: 0 auto 14px;" />
            <div style="font-family: Georgia, serif; font-size: 20px; font-weight: 700; color: #1f2937; letter-spacing: -0.01em;">Etytomic Alignment</div>
          </div>
          <h1 style="font-family: Georgia, serif; font-size: 24px; margin: 0 0 12px;">Account created</h1>
          <p style="font-size: 16px; margin: 0 0 14px;">${greeting}</p>
          <p style="font-size: 16px; margin: 0 0 20px;">Your Etytomic Alignment account has been created. You can now log in and begin the alignment assessment.</p>
          <p style="margin: 0 0 24px;"><a href="${APP_URL}" style="display: inline-block; background: #4A6FA5; color: white; text-decoration: none; border-radius: 8px; padding: 12px 18px; font-size: 14px; font-weight: 700;">Open Etytomic Alignment</a></p>
          <p style="font-size: 14px; color: #6b7280; margin: 0;">This is a reflective spiritual growth tool for noticing alignment and resistance across spirit, soul, and body.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Resend send failed: ${response.status} ${message}`);
  }

  return response.json();
};

export default {
  fetch: async (req: Request) => {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    if (req.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405, headers: corsHeaders });
    }

    try {
      const body = await req.json().catch(() => ({}));
      const email = String(body.email || "").trim().toLowerCase();
      const displayName = String(body.displayName || "").trim();

      if (!email || !email.includes("@")) {
        return Response.json({ error: "A valid email is required" }, { status: 400, headers: corsHeaders });
      }

      await sendWelcomeEmail(email, displayName);
      return Response.json({ sent: true }, { headers: corsHeaders });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Unable to send welcome email", message);
      return Response.json({ error: message }, { status: 500, headers: corsHeaders });
    }
  },
};
