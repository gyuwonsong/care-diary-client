"use client";

import type React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import AddressField from "@/components/register/address-field";
import YearMonthSelect from "@/components/register/year-month-select";

import {
  getOAuthProvider,
  getOAuthSession,
  OAuthProvider,
  OAuthType,
  updateOAuthToken,
} from "@/lib/auth-storage";
import { decodeJwtPayload } from "@/lib/jwt";
import { userApi } from "@/lib/api/client";

import {
  GENDER_LABELS,
  DISABILITY_SEVERITY_LABELS,
  DISABILITY_STATUS_LABELS,
  MEDICAL_COVERAGE_LABELS,
  PROVIDER_LABELS,
} from "@/lib/constants";

import {
  type UserRegisterRequest,
  UserRegisterRequestRoleEnum,
  UserRegisterRequestGenderEnum,
  UserRegisterRequestMedicalCoverageEnum,
  UserRegisterRequestDisabilityStatusEnum,
  UserRegisterRequestDisabilitySeverityEnum,
} from "@/generated-api";
import {
  SOCIAL_WELFARE_LABELS,
  type SocialWelfareService,
} from "@/lib/constants";

type RegisterFormData = Omit<
  UserRegisterRequest,
  "birthDate" | "specialCaseRegisteredDate" | "socialWelfareServiceLabels"
> & {
  birthDate: string;
  specialCaseRegisteredDate?: string;
  socialWelfareServiceLabels: SocialWelfareService[];
};

export default function RegisterPage() {
  const router = useRouter();

  const [oauthType, setOauthType] = useState<OAuthType | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [provider, setProvider] = useState<OAuthProvider | null>(null);

  useEffect(() => {
    const s = getOAuthSession();
    setOauthType(s.type);
    setToken(s.token);
    setProvider(getOAuthProvider());
    setAuthReady(true);
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [readonlyEmail, setReadonlyEmail] = useState("");

  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    role: UserRegisterRequestRoleEnum.User,
    gender: UserRegisterRequestGenderEnum.Male,
    birthDate: "",
    address: "",

    primaryDiagnosis: "",
    educationBeforeOnset: "",
    previousDiagnosis: "",
    diagnosisYearMonth: "",
    diagnosisHospital: "",
    chiefComplaint: "",
    currentHospital: "",
    currentResidence: "",
    medicalCoverage: undefined,

    specialCaseRegistered: false,
    specialCaseRegisteredDate: "",

    disabilityRegistered: false,
    disabilityStatus: UserRegisterRequestDisabilityStatusEnum.NotRegistered,
    disabilityType: "",
    disabilitySeverity: undefined,

    socialWelfareServiceLabels: [],
  });

  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");

  const YEARS = Array.from({ length: 100 }, (_, i) =>
    String(new Date().getFullYear() - i),
  );

  const MONTHS = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );

  const DAYS = Array.from({ length: 31 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );

  useEffect(() => {
    if (birthYear && birthMonth && birthDay) {
      setFormData((prev) => ({
        ...prev,
        birthDate: `${birthYear}-${birthMonth}-${birthDay}`,
      }));
    }
  }, [birthYear, birthMonth, birthDay]);

  useEffect(() => {
    if (!authReady) return;

    if (!token || oauthType !== "NEW") {
      router.replace("/login");
      return;
    }

    type JwtPayload = {
      name?: string;
      email?: string;
      userName?: string;
      userEmail?: string;
    };

    const payload = decodeJwtPayload<JwtPayload>(token);
    const nextEmail = payload?.email ?? payload?.userEmail ?? "";

    setReadonlyEmail(nextEmail);
  }, [authReady, token, oauthType, router]);

  const isAdmin = formData.role === UserRegisterRequestRoleEnum.Admin;

  const isBaseValid =
    formData.name.trim().length > 0 &&
    readonlyEmail.trim().length > 0 &&
    !!formData.birthDate &&
    formData.address.trim().length > 0;

  const userExtraValid = true;

  const isFormValid = isAdmin ? isBaseValid : isBaseValid && userExtraValid;

  const toggleSocialService = (key: SocialWelfareService) => {
    setFormData((prev) => {
      const list = prev.socialWelfareServiceLabels;
      const exists = list.includes(key);

      return {
        ...prev,
        socialWelfareServiceLabels: exists
          ? list.filter((v) => v !== key)
          : [...list, key],
      };
    });
  };

  const cleanEmptyStringToUndefined = <T extends object>(obj: T): T => {
    const out = { ...obj } as Record<string, unknown>;
    for (const k of Object.keys(out)) {
      if (out[k] === "") out[k] = undefined;
    }
    return out as T;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      router.replace("/login");
      return;
    }

    if (!formData.birthDate) return;

    setIsSubmitting(true);
    try {
      const isAdmin = formData.role === UserRegisterRequestRoleEnum.Admin;

      const baseRequired = {
        name: formData.name,
        role: formData.role,
        gender: formData.gender,
        birthDate: new Date(formData.birthDate),
        address: formData.address,
      } satisfies Pick<
        UserRegisterRequest,
        "name" | "role" | "gender" | "birthDate" | "address"
      >;

      const userRegisterRequest: UserRegisterRequest = isAdmin
        ? {
            ...baseRequired,

            primaryDiagnosis: undefined,
            educationBeforeOnset: undefined,
            previousDiagnosis: undefined,
            diagnosisYearMonth: undefined,
            diagnosisHospital: undefined,
            chiefComplaint: undefined,
            currentHospital: undefined,
            currentResidence: undefined,
            medicalCoverage: undefined,

            specialCaseRegistered: undefined,
            specialCaseRegisteredDate: undefined,

            disabilityRegistered: undefined,
            disabilityStatus: undefined,
            disabilityType: undefined,
            disabilitySeverity: undefined,

            socialWelfareServiceLabels: [],
          }
        : cleanEmptyStringToUndefined<UserRegisterRequest>({
            ...baseRequired,

            primaryDiagnosis: formData.primaryDiagnosis,
            educationBeforeOnset: formData.educationBeforeOnset,
            previousDiagnosis: formData.previousDiagnosis,
            diagnosisYearMonth: formData.diagnosisYearMonth,
            diagnosisHospital: formData.diagnosisHospital,
            chiefComplaint: formData.chiefComplaint,
            currentHospital: formData.currentHospital,
            currentResidence: formData.currentResidence,
            medicalCoverage: formData.medicalCoverage,

            specialCaseRegistered: formData.specialCaseRegistered,
            specialCaseRegisteredDate: formData.specialCaseRegistered
              ? formData.specialCaseRegisteredDate
                ? new Date(formData.specialCaseRegisteredDate)
                : undefined
              : undefined,

            disabilityRegistered: formData.disabilityRegistered,
            disabilityStatus: formData.disabilityStatus,
            disabilityType: formData.disabilityType,
            disabilitySeverity: formData.disabilitySeverity,

            socialWelfareServiceLabels:
              formData.socialWelfareServiceLabels ?? [],
          });

      const res = await userApi.register({ userRegisterRequest });
      const nextToken = res.data?.accessToken;

      if (nextToken) {
        updateOAuthToken(nextToken);
        const payload = decodeJwtPayload<{ role?: string }>(nextToken);

        if (payload?.role === "ADMIN") {
          router.push("/admin/users");
        } else {
          router.push("/register/questions");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary px-4 py-10 flex justify-center">
      <div className="w-full max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">회원가입</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            돌봄일기를 시작하기 위해 정보를 입력해주세요
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
            <div>
              <p className="text-sm font-medium">기본 정보 및 환자 정보 입력</p>
              <p className="mt-1 text-xs text-destructive font-medium">
                * 표시는 필수 입력 항목입니다.
              </p>
            </div>

            <Badge variant="secondary" className="rounded-sm">
              {provider ? PROVIDER_LABELS[provider] : "소셜"} 계정
            </Badge>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2">
                <p className="text-xs text-muted-foreground">
                  일반 사용자 또는 관리자 중 가입 유형을 선택할 수 있습니다.
                </p>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isAdmin"
                    className="bg-white"
                    checked={isAdmin}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        role:
                          checked === true
                            ? UserRegisterRequestRoleEnum.Admin
                            : UserRegisterRequestRoleEnum.User,
                      }))
                    }
                  />
                  <Label
                    htmlFor="isAdmin"
                    className="cursor-pointer font-normal text-xs"
                  >
                    관리자로 가입
                  </Label>
                </div>
              </div>

              {/* 기본 정보 */}
              <section className="space-y-5">
                <h2 className="text-lg font-bold">기본 정보</h2>

                <div className="space-y-2">
                  <Label htmlFor="name">
                    이름 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="이름을 입력하세요"
                    autoComplete="name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    이메일 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    value={readonlyEmail}
                    readOnly
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    성별 <span className="text-destructive">*</span>
                  </Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(value: UserRegisterRequestGenderEnum) =>
                      setFormData((prev) => ({ ...prev, gender: value }))
                    }
                    className="flex flex-row space-x-6"
                  >
                    {Object.entries(GENDER_LABELS).map(([value, label]) => (
                      <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem value={value} id={value} />
                        <Label htmlFor={value}>{label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>
                    생년월일 <span className="text-destructive">*</span>
                  </Label>

                  <div className="flex gap-3">
                    {/* 년 */}
                    <Select value={birthYear} onValueChange={setBirthYear}>
                      <SelectTrigger className="w-full h-9 px-3">
                        <SelectValue placeholder="년" />
                      </SelectTrigger>
                      <SelectContent
                        side="bottom"
                        align="start"
                        sideOffset={4}
                        avoidCollisions={false}
                      >
                        {" "}
                        {YEARS.map((y) => (
                          <SelectItem key={y} value={y}>
                            {y}년
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* 월 */}
                    <Select value={birthMonth} onValueChange={setBirthMonth}>
                      <SelectTrigger className="w-full h-9 px-3">
                        <SelectValue placeholder="월" />
                      </SelectTrigger>
                      <SelectContent
                        side="bottom"
                        align="start"
                        sideOffset={4}
                        avoidCollisions={false}
                      >
                        {" "}
                        {MONTHS.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}월
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* 일 */}
                    <Select value={birthDay} onValueChange={setBirthDay}>
                      <SelectTrigger className="w-full h-9 px-3">
                        <SelectValue placeholder="일" />
                      </SelectTrigger>
                      <SelectContent
                        side="bottom"
                        align="start"
                        sideOffset={4}
                        avoidCollisions={false}
                      >
                        {" "}
                        {DAYS.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}일
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <AddressField
                    value={formData.address}
                    onChangeAction={(next) =>
                      setFormData((prev) => ({ ...prev, address: next }))
                    }
                    required
                  />
                </div>
              </section>

              {/* 환자 정보 (USER Only) */}
              {!isAdmin && (
                <section className="space-y-5 pt-4 border-t">
                  <div className="flex flex-row items-center space-x-2">
                    <h2 className="text-lg font-bold">환자 정보</h2>
                    <span className="text-xs text-muted-foreground">
                      (선택)
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="primaryDiagnosis">주 진단명</Label>
                    <Input
                      id="primaryDiagnosis"
                      value={formData.primaryDiagnosis ?? ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          primaryDiagnosis: e.target.value,
                        }))
                      }
                      placeholder="주 진단명을 입력하세요"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="educationBeforeOnset">학력 (발병 전)</Label>
                    <Input
                      id="educationBeforeOnset"
                      value={formData.educationBeforeOnset ?? ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          educationBeforeOnset: e.target.value,
                        }))
                      }
                      placeholder="예: 대학교 4학년 재학, 고졸 등"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="previousDiagnosis">병력 - 진단명</Label>
                    <Input
                      id="previousDiagnosis"
                      value={formData.previousDiagnosis ?? ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          previousDiagnosis: e.target.value,
                        }))
                      }
                      placeholder="과거 진단명을 입력하세요"
                    />
                  </div>

                  <YearMonthSelect
                    label="병력 - 진단받은 시기"
                    value={formData.diagnosisYearMonth ?? ""}
                    onChangeAction={(next) =>
                      setFormData((prev) =>
                        prev.diagnosisYearMonth === next
                          ? prev
                          : { ...prev, diagnosisYearMonth: next },
                      )
                    }
                  />

                  <div className="space-y-2">
                    <Label htmlFor="diagnosisHospital">
                      병력 - 진단받은 병원
                    </Label>
                    <Input
                      id="diagnosisHospital"
                      value={formData.diagnosisHospital ?? ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          diagnosisHospital: e.target.value,
                        }))
                      }
                      placeholder="병원명을 입력하세요"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chiefComplaint">주증상</Label>
                    <Input
                      id="chiefComplaint"
                      value={formData.chiefComplaint ?? ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          chiefComplaint: e.target.value,
                        }))
                      }
                      placeholder="주요 증상을 입력하세요"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentHospital">
                      현재 주로 이용하는 병원
                    </Label>
                    <Input
                      id="currentHospital"
                      value={formData.currentHospital ?? ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          currentHospital: e.target.value,
                        }))
                      }
                      placeholder="현재 다니는 병원을 입력하세요"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentResidence">현재 거주하는 장소</Label>
                    <Input
                      id="currentResidence"
                      value={formData.currentResidence ?? ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          currentResidence: e.target.value,
                        }))
                      }
                      placeholder="예: 본가, 그룹홈, 자립주택 등"
                    />
                  </div>

                  {/* 의료보장 */}
                  <div className="space-y-2 pt-2">
                    <Label>의료보장</Label>
                    <RadioGroup
                      value={formData.medicalCoverage ?? ""}
                      onValueChange={(
                        value: UserRegisterRequestMedicalCoverageEnum,
                      ) =>
                        setFormData((prev) => ({
                          ...prev,
                          medicalCoverage: value,
                        }))
                      }
                      className="flex flex-wrap gap-4"
                    >
                      {Object.entries(MEDICAL_COVERAGE_LABELS).map(
                        ([value, label]) => (
                          <div
                            key={value}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              value={value}
                              id={`medical-${value}`}
                            />
                            <Label
                              htmlFor={`medical-${value}`}
                              className="font-normal"
                            >
                              {label}
                            </Label>
                          </div>
                        ),
                      )}
                    </RadioGroup>
                  </div>

                  {/* 산정 특례 */}
                  <div className="space-y-3">
                    <Label>산정특례</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="specialCaseRegistered"
                        checked={!!formData.specialCaseRegistered}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            specialCaseRegistered: checked === true,
                            specialCaseRegisteredDate:
                              checked === true
                                ? prev.specialCaseRegisteredDate
                                : "",
                          }))
                        }
                      />
                      <Label
                        htmlFor="specialCaseRegistered"
                        className="font-normal"
                      >
                        등록
                      </Label>
                    </div>

                    {formData.specialCaseRegistered && (
                      <div className="space-y-2">
                        <Label htmlFor="specialCaseRegisteredDate">
                          등록일
                        </Label>
                        <Input
                          id="specialCaseRegisteredDate"
                          type="date"
                          value={formData.specialCaseRegisteredDate ?? ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              specialCaseRegisteredDate: e.target.value,
                            }))
                          }
                          placeholder="등록일을 입력하세요"
                        />
                      </div>
                    )}
                  </div>

                  {/* 장애 */}
                  <div className="space-y-3">
                    <Label>장애 등급</Label>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="disabilityRegistered"
                        checked={!!formData.disabilityRegistered}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            disabilityRegistered: checked === true,
                            disabilityStatus:
                              checked === true
                                ? prev.disabilityStatus
                                : UserRegisterRequestDisabilityStatusEnum.NotRegistered,
                            disabilityType:
                              checked === true ? prev.disabilityType : "",
                            disabilitySeverity:
                              checked === true
                                ? prev.disabilitySeverity
                                : undefined,
                          }))
                        }
                      />
                      <Label
                        htmlFor="disabilityRegistered"
                        className="font-normal"
                      >
                        등록
                      </Label>
                    </div>

                    {formData.disabilityRegistered && (
                      <>
                        <div className="space-y-2">
                          <Label>진행 상태</Label>
                          <RadioGroup
                            value={
                              formData.disabilityStatus ??
                              UserRegisterRequestDisabilityStatusEnum.NotRegistered
                            }
                            onValueChange={(
                              value: UserRegisterRequestDisabilityStatusEnum,
                            ) =>
                              setFormData((prev) => ({
                                ...prev,
                                disabilityStatus: value,
                                disabilityType:
                                  value ===
                                  UserRegisterRequestDisabilityStatusEnum.Registered
                                    ? prev.disabilityType
                                    : "",
                                disabilitySeverity:
                                  value ===
                                  UserRegisterRequestDisabilityStatusEnum.Registered
                                    ? prev.disabilitySeverity
                                    : undefined,
                              }))
                            }
                            className="flex flex-wrap gap-4"
                          >
                            {Object.entries(DISABILITY_STATUS_LABELS).map(
                              ([value, label]) => (
                                <div
                                  key={value}
                                  className="flex items-center space-x-2"
                                >
                                  <RadioGroupItem
                                    value={value}
                                    id={`disability-status-${value}`}
                                  />
                                  <Label
                                    htmlFor={`disability-status-${value}`}
                                    className="font-normal"
                                  >
                                    {label}
                                  </Label>
                                </div>
                              ),
                            )}
                          </RadioGroup>
                        </div>

                        {formData.disabilityStatus ===
                          UserRegisterRequestDisabilityStatusEnum.Registered && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="disabilityType">종류</Label>
                              <Input
                                id="disabilityType"
                                value={formData.disabilityType ?? ""}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    disabilityType: e.target.value,
                                  }))
                                }
                                placeholder="예: 지체, 시각, 청각 등"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>정도</Label>
                              <RadioGroup
                                value={formData.disabilitySeverity ?? ""}
                                onValueChange={(
                                  value: UserRegisterRequestDisabilitySeverityEnum,
                                ) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    disabilitySeverity: value,
                                  }))
                                }
                                className="flex flex-wrap gap-4"
                              >
                                {Object.entries(DISABILITY_SEVERITY_LABELS).map(
                                  ([value, label]) => (
                                    <div
                                      key={value}
                                      className="flex items-center space-x-2 mt-2.5"
                                    >
                                      <RadioGroupItem
                                        value={value}
                                        id={`severity-${value}`}
                                      />
                                      <Label
                                        htmlFor={`severity-${value}`}
                                        className="font-normal"
                                      >
                                        {label}
                                      </Label>
                                    </div>
                                  ),
                                )}
                              </RadioGroup>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* 사회복지서비스 (복수 선택) */}
                  <div className="space-y-3">
                    <Label>사회복지서비스</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(SOCIAL_WELFARE_LABELS).map(
                        ([key, label]) => {
                          const k = key as SocialWelfareService;
                          const checked =
                            formData.socialWelfareServiceLabels.includes(k);

                          return (
                            <div
                              key={k}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`service-${k}`}
                                checked={checked}
                                onCheckedChange={() => toggleSocialService(k)}
                              />
                              <Label
                                htmlFor={`service-${k}`}
                                className="font-normal"
                              >
                                {label}
                              </Label>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>
                </section>
              )}

              <div className="space-y-3 pt-2">
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting || !isFormValid}
                >
                  {isSubmitting ? "처리 중..." : "다음"}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  이미 계정이 있으신가요?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-primary hover:underline"
                  >
                    로그인
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
