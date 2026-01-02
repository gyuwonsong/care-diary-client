export type OAuthType = "SUCCESS" | "NEW" | "DUPLICATE_EMAIL";
export type OAuthProvider = "google" | "naver" | "kakao";

const KEYS = {
  type: "oauth:type",
  token: "oauth:token",
  provider: "oauth:provider",
} as const;

function canUseSessionStorage(): boolean {
  return typeof window !== "undefined" && typeof sessionStorage !== "undefined";
}

export function setOAuthProvider(provider: OAuthProvider) {
  if (!canUseSessionStorage()) return;
  sessionStorage.setItem(KEYS.provider, provider);
}

export function getOAuthProvider(): OAuthProvider | null {
  if (!canUseSessionStorage()) return null;
  const v = sessionStorage.getItem(KEYS.provider);
  return v === "google" || v === "naver" || v === "kakao" ? v : null;
}

export function setOAuthSession(type: OAuthType, token: string) {
  if (!canUseSessionStorage()) return;
  sessionStorage.setItem(KEYS.type, type);
  sessionStorage.setItem(KEYS.token, token);
}

export function getOAuthSession(): {
  type: OAuthType | null;
  token: string | null;
} {
  if (!canUseSessionStorage()) return { type: null, token: null };
  const type = sessionStorage.getItem(KEYS.type) as OAuthType | null;
  const token = sessionStorage.getItem(KEYS.token);
  return { type, token };
}

export function updateOAuthToken(nextToken: string) {
  if (!canUseSessionStorage()) return;
  sessionStorage.setItem(KEYS.token, nextToken);
}
