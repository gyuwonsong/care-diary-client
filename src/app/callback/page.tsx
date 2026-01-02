"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setOAuthSession } from "@/lib/auth-storage";
import type { OAuthType } from "@/lib/auth-storage";

const isOAuthType = (v: string): v is OAuthType =>
  v === "SUCCESS" || v === "NEW" || v === "DUPLICATE_EMAIL";

export default function CallbackPage() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    const typeParam = sp.get("type");
    const token = sp.get("token");

    // TODO : 에러 콜백 공통 페이지 처리
    if (!typeParam || !token || !isOAuthType(typeParam)) {
      router.replace("/login?error=invalid_callback");
      return;
    }

    setOAuthSession(typeParam, token);
    console.log(
      "saved token head:",
      sessionStorage.getItem("oauth:token")?.slice(0, 20),
    );

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

    // TODO : DUPLICATE_EMAIL 처리
    // router.replace("/login/duplicate-email");
  }, [router, sp]);

  return null;
}
