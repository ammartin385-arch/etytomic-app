const PREMIUM_STATE_KEY = "etytomic_premium_state";
const LEGACY_DEV_PREMIUM_KEY = "etytomic_dev_premium_mode";
const DEV_PREMIUM_DEFAULT = true;

export function getDefaultPremiumState() {
  return {
    developerPremiumEnabled: DEV_PREMIUM_DEFAULT,
    lastKnownUser: null,
    premiumStatus: "developer",
  };
}

export function readPremiumState() {
  if (typeof window === "undefined") return getDefaultPremiumState();

  try {
    const stored = window.localStorage.getItem(PREMIUM_STATE_KEY);
    if (stored) {
      const restored = {
        ...getDefaultPremiumState(),
        ...JSON.parse(stored),
      };
      console.info("premium restored", restored);
      return restored;
    }

    const legacy = window.localStorage.getItem(LEGACY_DEV_PREMIUM_KEY);
    const migrated = {
      ...getDefaultPremiumState(),
      developerPremiumEnabled:
        legacy === null ? DEV_PREMIUM_DEFAULT : legacy === "true",
    };

    window.localStorage.setItem(PREMIUM_STATE_KEY, JSON.stringify(migrated));
    console.info("premium restored", migrated);
    return migrated;
  } catch (error) {
    console.warn("Unable to restore premium state.", error);
    return getDefaultPremiumState();
  }
}

export function savePremiumState(nextState) {
  if (typeof window === "undefined") return;

  try {
    const current = readPremiumState();
    const merged = {
      ...getDefaultPremiumState(),
      ...current,
      ...nextState,
    };

    window.localStorage.setItem(PREMIUM_STATE_KEY, JSON.stringify(merged));
    window.localStorage.setItem(
      LEGACY_DEV_PREMIUM_KEY,
      merged.developerPremiumEnabled ? "true" : "false",
    );
  } catch (error) {
    console.warn("Unable to save premium state.", error);
  }
}

export function setDeveloperPremiumEnabled(enabled) {
  savePremiumState({
    developerPremiumEnabled: Boolean(enabled),
    premiumStatus: enabled ? "developer" : "free",
  });

  console.info(enabled ? "premium enabled" : "premium disabled", {
    developerPremiumEnabled: Boolean(enabled),
  });
}
