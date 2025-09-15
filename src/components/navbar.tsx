"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  LogOut,
  User as UserIcon,
  Home,
  Shield,
  Users,
  BarChart3,
  FileText,
  ChevronDown,
} from "lucide-react";

type Role = "admin" | "user";

const NAV_CLASSES =
  "flex items-center gap-2 text-sm font-medium transition-colors rounded-sm px-2 py-1";
const NAV_ACTIVE = "text-primary font-semibold";
const NAV_INACTIVE = "text-muted-foreground hover:text-foreground";

function NavLink({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("group", NAV_CLASSES, active ? NAV_ACTIVE : NAV_INACTIVE)}
      aria-current={active ? "page" : undefined}
    >
      {/* 기존: group-hover:text-white */}
      <Icon className="h-4 w-4 transition-colors group-hover:text-primary" />
      <span className="group-hover:text-primary">{label}</span>
    </Link>
  );
}

function AdminMenu({ active }: { active: boolean }) {
  const adminItems = [
    { href: "/admin/user-management", icon: Users, label: "사용자 관리" },
    { href: "/admin/usage-management", icon: BarChart3, label: "사용량 관리" },
    {
      href: "/admin/analysis-management",
      icon: FileText,
      label: "분석기록 관리",
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "group",
            NAV_CLASSES,
            active ? NAV_ACTIVE : NAV_INACTIVE,
            "hover:bg-primary hover:text-white",
            "data-[state=open]:bg-primary data-[state=open]:text-white",
          )}
        >
          <Shield className="h-4 w-4 transition-colors group-hover:text-white group-data-[state=open]:text-white" />
          관리자
          <ChevronDown className="h-3.5 w-3.5 transition-colors group-hover:text-white group-data-[state=open]:text-white" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-56 p-2"
        sideOffset={6}
        aria-label="관리자 메뉴"
      >
        <DropdownMenuLabel className="px-2 py-1.5 text-xs text-muted-foreground">
          관리자 메뉴
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {adminItems.map(({ href, icon: Icon, label }) => (
            <DropdownMenuItem
              key={href}
              asChild
              className="group cursor-pointer rounded-sm"
            >
              <Link href={href} className="w-full flex items-center">
                <Icon className="mr-2 h-4 w-4 transition-colors group-hover:text-white" />
                <span className="transition-colors">{label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Navbar() {
  const currentUserName = "김의사";
  const currentUserEmail = "doctor.kim@example.com";
  const userRole: Role = "admin";

  const pathname = usePathname();
  const router = useRouter();

  const goProfile = () => router.push("/profile");
  const logout = () => {
    router.push("/login");
  };

  const isDashboard = pathname === "/dashboard";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <nav
      className="h-16 bg-white border-b border-border flex items-center justify-between px-8 shadow-sm"
      role="navigation"
      aria-label="Global"
    >
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="text-xl font-bold text-primary whitespace-nowrap"
          aria-label="Care Diary 홈으로 이동"
        >
          Care Diary
        </Link>

        <div className="flex items-center gap-2 sm:gap-6">
          <NavLink
            href="/dashboard"
            icon={Home}
            label="대시보드"
            active={isDashboard}
          />

          {userRole === "admin" && <AdminMenu active={isAdmin} />}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-foreground hidden sm:inline">
          {currentUserName} 님
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-sm hover:bg-accent"
              aria-label="사용자 메뉴 열기"
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                  {currentUserName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56" sideOffset={6}>
            <DropdownMenuLabel className="leading-5">
              <div className="font-semibold">{currentUserName}</div>
              <div className="text-xs text-muted-foreground">
                {currentUserEmail}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={goProfile}
              className="group cursor-pointer rounded-sm"
            >
              <UserIcon className="mr-2 h-4 w-4 transition-colors group-hover:text-white" />
              <span className="transition-colors">마이페이지</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={logout}
              className="group cursor-pointer rounded-sm text-destructive focus:text-white focus:bg-destructive hover:text-white hover:bg-destructive"
            >
              <LogOut className="mr-2 h-4 w-4 transition-colors group-hover:text-white group-focus:text-white" />
              <span>로그아웃</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
