"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getOAuthSession, clearOAuthSession } from "@/lib/auth-storage";
import { decodeJwtPayload } from "@/lib/jwt";

type JwtPayload = { exp?: number };

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const { token } = getOAuthSession();
    if (!token) {
      router.replace("/login");
      return;
    }

    const payload = decodeJwtPayload<JwtPayload>(token);
    if (payload?.exp && payload.exp * 1000 < Date.now()) {
      clearOAuthSession();
      router.replace("/login?reason=expired");
    }
  }, [router]);

  return <>{children}</>;
}
