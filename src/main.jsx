import "./app-bundle.css";
import "./header-overrides.css";
import "./brandAssets.js";
import "./premiumPersistence.js";
import "./growthGuidance.js";

const normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/";

if (normalizedPath === "/admin") {
  import("./AdminDashboard.jsx").then(({ renderAdminDashboard }) => {
    renderAdminDashboard(document.getElementById("root"));
  });
} else {
  import("./app-bundle.js");
}
