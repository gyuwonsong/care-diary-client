"use client";

import { getMockCurrentUser } from "@/lib/auth-mock";

export function useCurrentUser() {
  const user = getMockCurrentUser();

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: user.role,
  };
}
