"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Save,
  Eye,
  EyeOff,
  FileText,
  CheckCircle,
  Edit,
  Download,
} from "lucide-react";
import { toast } from "sonner";

export interface UserData {
  name: string;
  email: string;
  organization: string;
  userType: "user" | "admin";
  joinDate: string;
  lastLogin: string;
}

export interface ProfileSettingsProps {
  userData: UserData;
  onUserDataChange: (userData: UserData) => void;
  onChangePassword?: (payload: {
    current: string;
    next: string;
  }) => Promise<void> | void;
  onDownloadDocument?: () => Promise<void> | void;
  documentName?: string | null;
  documentStatus?: "approved" | "pending" | "rejected";
}

function FieldRow({
  id,
  label,
  children,
  helper,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  helper?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Label htmlFor={id}>{label}</Label>
        {helper && <span className="text-xs text-destructive">{helper}</span>}
      </div>
      {children}
    </div>
  );
}

function PasswordField({
  id,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-white border"
        autoComplete="new-password"
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "비밀번호 숨기기" : "비밀번호 보기"}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  );
}

export default function ProfileSettings({
  userData,
  onUserDataChange,
  onChangePassword,
  onDownloadDocument,
  documentName = "의사면허증.pdf",
  documentStatus = "approved",
}: ProfileSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: userData.name,
    organization: userData.organization,
  });

  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });

  const roleBadge = useMemo(
    () => (
      <Badge
        variant={userData.userType === "admin" ? "default" : "secondary"}
        className={
          userData.userType === "admin"
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-muted-foreground"
        }
      >
        {userData.userType === "admin" ? "관리자" : "사용자"}
      </Badge>
    ),
    [userData.userType],
  );

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      if (!form.name.trim()) throw new Error("이름을 입력해주세요.");
      if (!form.organization.trim())
        throw new Error("소속기관을 입력해주세요.");
      onUserDataChange({ ...userData, ...form });
      setIsEditing(false);
      toast.success("프로필이 성공적으로 업데이트되었습니다.");
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : "프로필 업데이트 중 오류가 발생했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setIsLoading(true);
    try {
      if (!pw.current) throw new Error("현재 비밀번호를 입력해주세요.");
      if (!pw.next) throw new Error("새 비밀번호를 입력해주세요.");
      if (pw.next.length < 8)
        throw new Error("새 비밀번호는 8자 이상이어야 합니다.");
      if (pw.next !== pw.confirm)
        throw new Error("새 비밀번호가 일치하지 않습니다.");

      if (onChangePassword)
        await onChangePassword({ current: pw.current, next: pw.next });

      toast.success("비밀번호가 성공적으로 변경되었습니다.");
      setPw({ current: "", next: "", confirm: "" });
      setIsPasswordModalOpen(false);
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : "비밀번호 변경 중 오류가 발생했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      await onDownloadDocument?.();
      toast.success("파일 다운로드가 시작되었습니다.");
    } catch {
      toast.error("파일 다운로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">프로필 설정</h2>
      </div>

      <Card className={`rounded-sm ${isEditing ? "bg-white" : "bg-muted"}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="min-h-9">기본 정보</CardTitle>
            {!isEditing && (
              <Button
                variant="outline"
                onClick={() => setIsEditing((v) => !v)}
                className="bg-white border min-w-[130px]"
              >
                <Edit className="h-4 w-4" />
                프로필 변경
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FieldRow
                id="email"
                label="이메일"
                helper="* 이메일은 변경할 수 없습니다."
              >
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  disabled
                  className="bg-white border"
                />
              </FieldRow>
            </div>

            <FieldRow id="name" label="이름">
              <Input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="이름을 입력하세요"
                disabled={!isEditing}
                className="bg-white border"
              />
            </FieldRow>

            <FieldRow id="organization" label="소속기관">
              <Input
                id="organization"
                type="text"
                value={form.organization}
                onChange={(e) =>
                  setForm((p) => ({ ...p, organization: e.target.value }))
                }
                placeholder="소속기관을 입력하세요"
                disabled={!isEditing}
                className="bg-white border"
              />
            </FieldRow>
          </div>

          {isEditing && (
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="bg-white border min-w-[65px]"
              >
                취소
              </Button>
              <Button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="min-w-[65px]"
              >
                <Save className="h-4 w-4" />
                {isLoading ? "저장 중..." : "저장"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-sm bg-muted">
        <CardHeader>
          <CardTitle>보안 설정</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 sm:p-5 border rounded-sm bg-white">
            <div className="min-w-0">
              <div className="font-medium text-sm">비밀번호 변경</div>
              <div className="text-xs text-muted-foreground">
                계정 보안을 위해 정기적으로 비밀번호를 변경하세요
              </div>
            </div>

            <Dialog
              open={isPasswordModalOpen}
              onOpenChange={setIsPasswordModalOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white border min-w-[130px] w-full sm:w-auto"
                >
                  비밀번호 변경
                </Button>
              </DialogTrigger>

              <DialogContent className="rounded-sm w-[92vw] sm:w-full sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>비밀번호 변경</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <FieldRow id="currentPassword" label="현재 비밀번호">
                    <PasswordField
                      id="currentPassword"
                      placeholder="현재 비밀번호"
                      value={pw.current}
                      onChange={(v) => setPw((p) => ({ ...p, current: v }))}
                    />
                  </FieldRow>

                  <FieldRow id="newPassword" label="새 비밀번호">
                    <PasswordField
                      id="newPassword"
                      placeholder="새 비밀번호 (8자 이상)"
                      value={pw.next}
                      onChange={(v) => setPw((p) => ({ ...p, next: v }))}
                    />
                  </FieldRow>

                  <FieldRow id="confirmPassword" label="비밀번호 확인">
                    <PasswordField
                      id="confirmPassword"
                      placeholder="비밀번호 확인"
                      value={pw.confirm}
                      onChange={(v) => setPw((p) => ({ ...p, confirm: v }))}
                    />
                  </FieldRow>

                  <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2 sm:pt-4 sm:justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setIsPasswordModalOpen(false)}
                      className="min-w-[65px] w-full sm:w-auto"
                    >
                      취소
                    </Button>
                    <Button
                      onClick={handleChangePassword}
                      disabled={isLoading}
                      className="min-w-[65px] w-full sm:w-auto"
                    >
                      <Save className="h-4 w-4" />
                      {isLoading ? "변경 중..." : "변경"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-sm bg-muted">
        <CardHeader>
          <CardTitle>증빙서류 관리</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 sm:p-5 border rounded-sm bg-white">
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5 sm:mt-0 mx-1" />
              <div className="min-w-0">
                <div className="flex flex-row w-full items-center gap-2">
                  <div className="font-medium text-sm">
                    현재 등록된 증빙서류
                  </div>
                  {documentStatus === "approved" && (
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 text-xs flex-shrink-0"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      승인됨
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {documentName ?? "등록된 파일 없음"}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:self-auto w-full sm:w-auto">
              {documentName && (
                <Button
                  variant="outline"
                  className="bg-white border flex-1 sm:flex-none min-w-[130px]"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                  다운로드
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
