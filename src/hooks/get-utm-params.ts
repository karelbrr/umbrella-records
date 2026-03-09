export const getUTMParams = () => {
  if (typeof window === "undefined") return {};

  const searchParams = new URLSearchParams(window.location.search);
  const utms: Record<string, string> = {};

  const utmKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ];

  utmKeys.forEach((key) => {
    const value = searchParams.get(key);
    if (value) utms[key] = value;
  });

  return utms;
};

export const getStoredUTMs = () => {
  if (typeof window === "undefined") return {};

  const currentUTMs = getUTMParams();

  if (Object.keys(currentUTMs).length > 0) {
    sessionStorage.setItem("captured_utms", JSON.stringify(currentUTMs));
    return currentUTMs;
  }

  const stored = sessionStorage.getItem("captured_utms");
  return stored ? JSON.parse(stored) : {};
};
