"use client";

import { useState } from "react";
import type React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    organization: "",
    userType: "",
  });
  const [fileName, setFileName] = useState("선택된 파일 없음");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      toast.error("비밀번호는 8자 이상이어야 합니다.");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Registration data:", formData);
      toast.success(
        "회원가입 신청이 완료되었습니다. 관리자 승인 후 이메일로 결과를 알려드립니다.",
      );
    } catch (err) {
      toast.error("회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full sm:w-[420px] max-w-[calc(100vw-2rem)] rounded-sm">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold text-primary tracking-tight">
            회원가입
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            관리자 승인 후 시스템 이용이 가능합니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">
                이메일
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="이메일을 입력하세요"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-white border rounded-sm !text-xs placeholder:text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm">
                이름
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="이름을 입력하세요"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="bg-white border rounded-sm !text-xs placeholder:text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">
                비밀번호
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요 (8자 이상)"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="bg-white border rounded-sm !text-xs placeholder:text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm">
                비밀번호 확인
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className="bg-white border rounded-sm !text-xs placeholder:text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization" className="text-sm">
                소속기관
              </Label>
              <Input
                id="organization"
                type="text"
                placeholder="소속기관을 입력하세요"
                value={formData.organization}
                onChange={(e) =>
                  handleInputChange("organization", e.target.value)
                }
                className="bg-white border rounded-sm !text-xs placeholder:text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document" className="text-sm">
                <div className="flex items-center gap-2">
                  <div>증빙서류</div>
                  <p className="text-xs text-destructive">
                    * PDF, JPG, PNG 파일만 업로드 가능합니다
                  </p>
                </div>
              </Label>

              <div className="flex items-center gap-2 border h-9 w-full min-w-0 rounded-sm shadow-xs px-2 py-1">
                <Input
                  id="document"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setFileName(file ? file.name : "선택된 파일 없음");
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="document"
                  className="flex items-center justify-center px-2 py-1 rounded-sm border bg-background shadow-xs cursor-pointer text-xs hover:bg-accent hover:text-accent-foreground"
                >
                  파일 선택
                </label>
                <span
                  className={cn(
                    "text-xs",
                    fileName === "선택된 파일 없음"
                      ? "text-muted-foreground"
                      : "text-foreground",
                  )}
                >
                  {fileName}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-sm"
              disabled={isLoading}
            >
              {isLoading ? "회원가입 중..." : "회원가입"}
            </Button>

            <div className="text-center space-y-2">
              <div className="text-xs text-muted-foreground">
                이미 계정이 있으신가요?{" "}
                <a href="/login" className="text-primary hover:underline">
                  로그인
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
