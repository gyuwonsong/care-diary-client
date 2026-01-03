"use client";

import { useEffect, useState } from "react";

import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  GENDER_LABELS,
  MEDICAL_COVERAGE_LABELS,
  SOCIAL_WELFARE_LABELS,
  SocialWelfareService,
  UserRole,
} from "@/lib/constants";

import { userApi } from "@/lib/api/client";

import {
  CurrentUserResponseDisabilitySeverityEnum,
  CurrentUserResponseDisabilityStatusEnum,
  CurrentUserResponseGenderEnum,
  CurrentUserResponseMedicalCoverageEnum,
  CurrentUserResponseRoleEnum,
} from "@/generated-api";
import {
  DISABILITY_SEVERITY_LABELS,
  DISABILITY_STATUS_LABELS,
} from "@/lib/constants";

type MyPageUserData = {
  name: string;
  email: string;
  role: CurrentUserResponseRoleEnum;

  gender: CurrentUserResponseGenderEnum;
  birth: string;
  address: string;

  mainDiagnosis?: string;
  education?: string;
  historyDiagnosis?: string;
  historyDate?: string;
  historyHospital?: string;
  mainSymptoms?: string;
  currentHospital?: string;
  currentResidence?: string;

  medicalCoverage?: CurrentUserResponseMedicalCoverageEnum;
  specialCaseRegistered?: boolean;
  specialCaseRegisteredDate?: string;

  disabilityRegistered?: boolean;
  disabilityStatus?: CurrentUserResponseDisabilityStatusEnum;
  disabilityType?: string;
  disabilitySeverity?: CurrentUserResponseDisabilitySeverityEnum;

  socialWelfareServices?: SocialWelfareService[];
};

function Field({
  label,
  value,
  className,
  small,
}: {
  label: string;
  value: string;
  className?: string;
  small?: boolean;
}) {
  return (
    <div className={className}>
      <p
        className={
          small
            ? "text-xs text-muted-foreground"
            : "text-sm font-medium text-muted-foreground"
        }
      >
        {label}
      </p>
      <p className="mt-1">{value}</p>
    </div>
  );
}

export default function MyPage() {
  const [userData, setUserData] = useState<MyPageUserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi
      .getMe()
      .then((res) => {
        const d = res.data;
        if (!d) return;

        setUserData({
          name: d.name,
          email: d.email,
          role: d.role,

          gender: d.gender,
          birth: d.birthDate.toISOString().slice(0, 10),
          address: d.address?.replaceAll("//", "").replace(/\s+/g, " ").trim(),

          mainDiagnosis: d.primaryDiagnosis,
          education: d.educationBeforeOnset,
          historyDiagnosis: d.previousDiagnosis,
          historyDate: d.diagnosisYearMonth,
          historyHospital: d.diagnosisHospital,
          mainSymptoms: d.chiefComplaint,
          currentHospital: d.currentHospital,
          currentResidence: d.currentResidence,

          medicalCoverage: d.medicalCoverage,
          specialCaseRegistered: d.specialCaseRegistered,
          specialCaseRegisteredDate: d.specialCaseRegisteredDate
            ? d.specialCaseRegisteredDate.toISOString().slice(0, 10)
            : undefined,

          disabilityRegistered: d.disabilityRegistered,
          disabilityStatus: d.disabilityStatus,
          disabilityType: d.disabilityType,
          disabilitySeverity: d.disabilitySeverity,

          socialWelfareServices:
            (d.socialWelfareServiceLabels as SocialWelfareService[]) ?? [],
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !userData) {
    return (
      <div className="min-h-screen bg-secondary">
        <Navbar />
      </div>
    );
  }

  const initials = userData.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const genderLabel = GENDER_LABELS[userData.gender] ?? "-";
  const medicalCoverageLabel = userData.medicalCoverage
    ? (MEDICAL_COVERAGE_LABELS[userData.medicalCoverage] ??
      userData.medicalCoverage)
    : "-";

  const isAdmin = userData.role === UserRole.ADMIN;

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />

      <main className="container max-w-5xl py-8 mx-auto space-y-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* 1. 상단 프로필 */}
          <Card className="rounded-sm">
            <CardContent className="flex items-center justify-between py-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h1 className="text-2xl font-bold">{userData.name}</h1>
                  <p className="text-sm text-muted-foreground">
                    {userData.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. 기본 정보 */}
          <Card className="rounded-sm">
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="이름" value={userData.name} />
                <Field label="이메일" value={userData.email} />
                <Field label="성별" value={genderLabel} />
                <Field label="생년월일" value={userData.birth || "-"} />
                <Field
                  label="주소"
                  value={userData.address || "-"}
                  className="sm:col-span-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* 3. 환자 정보 (ADMIN 제외) */}
          {!isAdmin && (
            <Card className="rounded-sm">
              <CardHeader>
                <CardTitle>환자 정보</CardTitle>
              </CardHeader>

              <CardContent className="space-y-8">
                <section className="space-y-3">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="주 진단명"
                      value={userData.mainDiagnosis || "-"}
                    />
                    <Field
                      label="학력 (발병 전)"
                      value={userData.education || "-"}
                    />
                  </div>
                </section>

                <hr className="border-border" />

                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    병력
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="진단명"
                      value={userData.historyDiagnosis || "-"}
                      small
                    />
                    <Field
                      label="진단받은 시기"
                      value={userData.historyDate || "-"}
                      small
                    />
                    <Field
                      label="진단받은 병원"
                      value={userData.historyHospital || "-"}
                      small
                      className="sm:col-span-2"
                    />
                  </div>
                </section>

                <hr className="border-border" />

                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    현재 상태
                  </h3>

                  <div className="space-y-4">
                    <Field
                      label="주증상"
                      value={userData.mainSymptoms || "-"}
                      small
                    />
                    <Field
                      label="현재 이용 병원"
                      value={userData.currentHospital || "-"}
                      small
                    />
                    <Field
                      label="현재 거주지"
                      value={userData.currentResidence || "-"}
                      small
                    />
                  </div>
                </section>

                <hr className="border-border" />

                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    의료·복지 정보
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="의료보장" value={medicalCoverageLabel} />

                    <Field
                      label="산정특례"
                      value={
                        userData.specialCaseRegistered
                          ? `등록 (${userData.specialCaseRegisteredDate || "-"})`
                          : "미등록"
                      }
                    />

                    <Field
                      label="장애 등록"
                      value={userData.disabilityRegistered ? "등록" : "미등록"}
                    />

                    {userData.disabilityRegistered && (
                      <>
                        <Field
                          label="진행 상태"
                          value={
                            userData.disabilityStatus
                              ? DISABILITY_STATUS_LABELS[
                                  userData.disabilityStatus
                                ]
                              : "-"
                          }
                        />
                        <Field
                          label="종류"
                          value={userData.disabilityType || "-"}
                        />
                        <Field
                          label="정도"
                          value={
                            userData.disabilitySeverity
                              ? DISABILITY_SEVERITY_LABELS[
                                  userData.disabilitySeverity
                                ]
                              : "-"
                          }
                        />
                      </>
                    )}

                    <div className="sm:col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        사회복지서비스
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {userData.socialWelfareServices?.length ? (
                          userData.socialWelfareServices.map((k) => (
                            <span
                              key={k}
                              className="inline-flex items-center rounded-sm border px-2 py-1 text-xs"
                            >
                              {SOCIAL_WELFARE_LABELS[k] ?? k}
                            </span>
                          ))
                        ) : (
                          <p className="mt-1">-</p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
