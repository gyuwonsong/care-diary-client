"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SocialLoginButton } from "@/components/auth/social-login-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserRole } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (provider: string) => {
    console.log(`${provider} login`);

    const mockRole: UserRole = UserRole.USER;

    document.cookie = `userRole=${mockRole}; path=/; max-age=${60 * 60 * 24 * 7}`;

    // @ts-expect-error
    if (mockRole === UserRole.ADMIN) {
      router.push("/admin/users");
    } else {
      router.push("/home");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">돌봄일기</CardTitle>
          <CardDescription className="text-sm">
            희귀질환 환자·보호자 기록에서 정신 상태와 SDoH를
            <br />
            LLM으로 자동 추출·분석하는 서비스
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <SocialLoginButton
              provider="google"
              onClick={() => handleLogin("Google")}
            />
            <SocialLoginButton
              provider="naver"
              onClick={() => handleLogin("Naver")}
            />
            <SocialLoginButton
              provider="kakao"
              onClick={() => handleLogin("Kakao")}
            />
          </div>
          <div className="pt-4 text-center">
            <p className="text-sm text-muted-foreground">
              아직 계정이 없으신가요?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                회원가입
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
