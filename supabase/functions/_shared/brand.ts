export const BRAND_ASSETS = {
  emailLogoPath: "/brand/logo-horizontal.png",
};

export const getEmailLogoUrl = (appUrl: string) =>
  Deno.env.get("EMAIL_LOGO_URL") || `${appUrl}${BRAND_ASSETS.emailLogoPath}`;
