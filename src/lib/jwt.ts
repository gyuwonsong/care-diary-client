type JwtPayload = Record<string, unknown>;

function base64UrlToUint8Array(base64Url: string) {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");

  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function decodeJwtPayload<T extends JwtPayload = JwtPayload>(
  token: string,
): T | null {
  if (typeof window === "undefined") return null;

  const raw = token.replace(/^Bearer\s+/i, "").trim();
  const parts = raw.split(".");
  if (parts.length !== 3) return null;

  try {
    const bytes = base64UrlToUint8Array(parts[1]);
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json) as T;
  } catch (e) {
    console.error("JWT decode failed:", e);
    console.log("token head:", token.slice(0, 20));
    console.log("parts:", token.trim().split(".").length);
    console.log("payload:", token.trim().split(".")[1]);

    return null;
  }
}
