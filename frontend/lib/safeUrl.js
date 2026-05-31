const ALLOWED_PROTOCOLS = new Set(["https:", "http:", "tel:", "mailto:"]);

export function safeExternalUrl(value, fallback = "#") {
  if (!value || typeof value !== "string") return fallback;
  if (value.startsWith("/") || value.startsWith("#")) return value;

  try {
    const url = new URL(value);
    return ALLOWED_PROTOCOLS.has(url.protocol) ? value : fallback;
  } catch {
    return fallback;
  }
}

export function digitsOnly(value) {
  return String(value || "").replace(/[^\d]/g, "");
}
