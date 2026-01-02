"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setOAuthSession } from "@/lib/auth-storage";
import type { OAuthType } from "@/lib/auth-storage";

const isOAuthType = (v: string): v is OAuthType =>
  v === "SUCCESS" || v === "NEW" || v === "DUPLICATE_EMAIL";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const typeParam = sp.get("type");
    const token = sp.get("token");

    // TODO : 에러 콜백 공통 페이지 처리
    if (!typeParam || !token || !isOAuthType(typeParam)) {
      router.replace("/login?error=invalid_callback");
      return;
    }

    setOAuthSession(typeParam, token);

    window.history.replaceState(
      {},
      "",
      `/callback?type=${encodeURIComponent(typeParam)}`,
    );

    if (typeParam === "SUCCESS") {
      router.replace("/home");
      return;
    }

    if (typeParam === "NEW") {
      router.replace("/register");
      return;
    }

    router.replace("/login/duplicate-email");
  }, [router]);

  return null;
}
