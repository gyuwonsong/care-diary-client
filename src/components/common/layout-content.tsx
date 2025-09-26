"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <main
      className={cn(
        "flex-1 grid place-items-center min-h-0",
        isDashboard ? "p-0" : "p-4",
      )}
    >
      {children}
    </main>
  );
}
