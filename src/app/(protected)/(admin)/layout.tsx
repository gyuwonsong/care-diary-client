"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getOAuthSession } from "@/lib/auth-storage";
import { decodeJwtPayload } from "@/lib/jwt";

type JwtPayload = { role?: "ADMIN" | "USER" };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const { token } = getOAuthSession();
    const payload = token ? decodeJwtPayload<JwtPayload>(token) : null;

    if (payload?.role !== "ADMIN") {
      router.replace("/home");
    }
  }, [router]);

  return <>{children}</>;
}
