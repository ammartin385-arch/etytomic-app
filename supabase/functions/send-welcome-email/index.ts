const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export default {
  fetch: async (req: Request) => {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    return Response.json(
      {
        error:
          "The account created welcome email has been disabled. Supabase Auth now sends the required verification email.",
      },
      { status: 410, headers: corsHeaders },
    );
  },
};
