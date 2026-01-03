"use client";

import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { UserRole } from "@/lib/constants";
import { clearOAuthSession, getOAuthSession } from "@/lib/auth-storage";
import { decodeJwtPayload } from "@/lib/jwt";

interface NavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

type AuthJwtPayload = {
  name?: string;
  role?: "ADMIN" | "USER";
};

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const [userName, setUserName] = useState("사용자");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const { token } = getOAuthSession();
    const payload = token ? decodeJwtPayload<AuthJwtPayload>(token) : null;

    const nextName = payload?.name?.trim() ? payload.name.trim() : "사용자";
    const nextIsAdmin = payload?.role === "ADMIN";

    setUserName(nextName);
    setIsAdmin(nextIsAdmin);
  }, []);

  const initial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-white">
      <div className="flex h-16 items-center justify-between px-8">
        <div className="flex items-center gap-8 ">
          <Link href="/home" className="flex items-center">
            <h1 className="text-xl font-bold cursor-pointer hover:opacity-80">
              돌봄일기
            </h1>
          </Link>

          {isAdmin && onTabChange && (
            <div className="flex gap-1">
              <Button
                variant={activeTab === "users" ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange("users")}
                className="rounded-sm"
              >
                사용자 관리
              </Button>
              <Button
                variant={activeTab === "usage" ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange("usage")}
                className="rounded-sm"
              >
                사용량 관리
              </Button>
            </div>
          )}
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="gap-3 h-auto py-2 px-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt={userName} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {initial}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{userName}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            sideOffset={20}
            className="w-48 rounded-sm p-2"
          >
            <div className="flex flex-col gap-1">
              <Link href="/mypage">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 rounded-sm"
                  size="sm"
                >
                  <User className="h-4 w-4" />
                  마이페이지
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 rounded-sm text-destructive hover:text-destructive"
                size="sm"
                onClick={() => {
                  clearOAuthSession();
                  window.location.replace("/login");
                }}
              >
                <LogOut className="h-4 w-4" />
                로그아웃
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
