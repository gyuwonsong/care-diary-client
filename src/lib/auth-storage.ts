export type OAuthType = "SUCCESS" | "NEW" | "DUPLICATE_EMAIL";
export type OAuthProvider = "google" | "naver" | "kakao";

const KEYS = {
  type: "oauth:type",
  token: "oauth:token",
  provider: "oauth:provider",
} as const;

export function setOAuthProvider(provider: OAuthProvider) {
  sessionStorage.setItem(KEYS.provider, provider);
}
export function getOAuthProvider(): OAuthProvider | null {
  const v = sessionStorage.getItem(KEYS.provider);
  return v === "google" || v === "naver" || v === "kakao" ? v : null;
}

export function setOAuthSession(type: OAuthType, token: string) {
  sessionStorage.setItem(KEYS.type, type);
  sessionStorage.setItem(KEYS.token, token);
}

export function getOAuthSession() {
  const type = sessionStorage.getItem(KEYS.type) as OAuthType | null;
  const token = sessionStorage.getItem(KEYS.token);
  return { type, token };
}

export function updateOAuthToken(nextToken: string) {
  sessionStorage.setItem(KEYS.token, nextToken);
}
