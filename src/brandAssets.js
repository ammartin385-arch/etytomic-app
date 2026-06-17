export const BRAND_ASSETS = Object.freeze({
  mark: "/brand/logo-mark.png",
  horizontal: "/brand/logo-horizontal.svg",
  stacked: "/brand/logo-stacked.png",
  emailLogo: "/brand/email-logo.png",
  appIcon: "/brand/app-icon.png",
  favicon: "/brand/logo-mark.png",
  openGraph: "/brand/logo-horizontal.png",
});

if (typeof window !== "undefined") {
  window.ETYTOMIC_BRAND_ASSETS = BRAND_ASSETS;
}
