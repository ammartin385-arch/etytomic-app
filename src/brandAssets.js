export const BRAND_ASSETS = Object.freeze({
  mark: "/brand/logo-mark.svg",
  horizontal: "/brand/logo-horizontal.png",
  stacked: "/brand/logo-stacked.png",
  emailLogo: "/brand/logo-horizontal.png",
  appIcon: "/brand/app-icon.png",
});

if (typeof window !== "undefined") {
  window.ETYTOMIC_BRAND_ASSETS = BRAND_ASSETS;
}
