import { toast } from "sonner";
import { clearOAuthSession } from "@/lib/auth-storage";

function safeGetPath(): string {
  if (typeof window === "undefined") return "";
  return window.location.pathname + window.location.search;
}

function redirectToLogin(reason: "expired" | "unauthorized") {
  if (typeof window === "undefined") return;

  const path = window.location.pathname;

  if (path === "/login" || path === "/callback" || path.startsWith("/login/")) {
    window.location.href = `/login?reason=${reason}`;
    return;
  }

  const next = encodeURIComponent(safeGetPath());
  window.location.href = `/login?reason=${reason}&next=${next}`;
}

async function tryReadMessage(res: Response): Promise<string | null> {
  if (res.status === 204) return null;

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return null;

  try {
    const json = await res.clone().json();
    const msg = json?.message;
    return typeof msg === "string" && msg.trim() ? msg : null;
  } catch {
    return null;
  }
}

export async function fetchWithSonner(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const method = (init?.method ?? "GET").toUpperCase();
  const isGet = method === "GET";

  const res = await fetch(input, init);

  if (res.status === 401) {
    const msg =
      (await tryReadMessage(res)) ??
      "세션이 만료되었습니다. 다시 로그인해주세요.";
    toast.error(msg);
    clearOAuthSession();
    redirectToLogin("expired");
    return res;
  }

  const msg = await tryReadMessage(res);

  if (isGet) return res;

  if (msg) {
    if (res.ok) toast.success(msg);
    else toast.error(msg);
    return res;
  }

  if (!res.ok) toast.error("요청 처리 중 오류가 발생했습니다.");

  return res;
}
