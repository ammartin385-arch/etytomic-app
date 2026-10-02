const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || "https://trmvlobqxgjathjmkdin.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_0KHV-ub2w0Fwsd1sG6kMxw_H83UIAbM";

const verificationId = `codex-prod-analytics-${new Date()
  .toISOString()
  .replace(/[:.]/g, "-")}`;

const response = await fetch(`${SUPABASE_URL}/rest/v1/page_views`, {
  method: "POST",
  headers: {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
  },
  body: JSON.stringify({
    user_id: null,
    visitor_id: verificationId,
    page: "analytics_verification",
    path: "/__analytics_verification",
    referrer: "production-analytics-verifier",
    user_agent: "Etytomic production analytics verifier",
  }),
});

if (!response.ok) {
  const details = await response.text();
  console.error("Production analytics verification failed.");
  console.error(`Status: ${response.status} ${response.statusText}`);
  console.error(details);
  console.error("");
  console.error("Common causes:");
  console.error("- 404/PGRST205: public.page_views is missing from production.");
  console.error("- 401/42501: the anonymous insert RLS policy is failing.");
  console.error("- Network/CORS errors: Supabase project URL or anon key is wrong.");
  process.exit(1);
}

console.log("Production analytics verification succeeded.");
console.log(`Inserted anonymous page view visitor_id: ${verificationId}`);
console.log(
  "Confirm with: supabase db query --linked \"select count(*) as total_page_views, count(distinct coalesce(user_id::text, visitor_id)) as unique_page_viewers from public.page_views;\"",
);
