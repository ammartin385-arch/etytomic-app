export const BRAND_ASSETS = Object.freeze({
  mark: "/brand/logo-mark.png",
  horizontal: "/brand/logo-horizontal.png",
  stacked: "/brand/logo-stacked.png",
  emailLogo: "/brand/logo-horizontal.png",
  appIcon: "/brand/app-icon.png",
  favicon: "/brand/logo-mark.png",
});

if (typeof window !== "undefined") {
  window.ETYTOMIC_BRAND_ASSETS = BRAND_ASSETS;
}
