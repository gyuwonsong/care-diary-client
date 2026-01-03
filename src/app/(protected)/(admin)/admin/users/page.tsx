"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { UserList } from "@/components/admin/user-list";
import { UserDetail } from "@/components/admin/user-detail";
import { UserRole, Gender } from "@/lib/constants";
import type { User, RiskInfo } from "@/lib/types";
import { UsageManagement } from "@/components/admin/usage-management";

export default function AdminUsersPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("users");

  const users: (User & {
    birthDate: string;
    disease: string;
    diaryCount: number;
    risk?: RiskInfo;
  })[] = [
    {
      id: "1",
      name: "김철수",
      birthDate: "1965.03.15",
      disease: "파킨슨병",
      role: UserRole.USER,
      email: "kim@example.com",
      gender: Gender.MALE,
      age: 58,
      diaryCount: 45,
      createdAt: new Date("2025-01-15"),
      risk: {
        isRisk: true,
        reason: "최근 2주간 우울 점수 지속 상승 및 일기 공백 5일 이상",
      },
    },
    {
      id: "2",
      name: "이영희",
      birthDate: "1970.08.22",
      disease: "알츠하이머",
      role: UserRole.USER,
      email: "lee@example.com",
      gender: Gender.FEMALE,
      age: 53,
      diaryCount: 32,
      createdAt: new Date("2025-02-01"),
      risk: {
        isRisk: false,
        reason: "",
      },
    },
    {
      id: "3",
      name: "박민수",
      birthDate: "1968.12.05",
      disease: "치매",
      role: UserRole.USER,
      email: "park@example.com",
      gender: Gender.MALE,
      age: 55,
      diaryCount: 28,
      createdAt: new Date("2025-01-20"),
      risk: {
        isRisk: true,
        reason: "전문의 소견 접수됨 (약물 조정 필요)",
      },
    },
    {
      id: "4",
      name: "최은정",
      birthDate: "1959.06.30",
      disease: "경도인지장애(MCI)",
      role: UserRole.USER,
      email: "choi@example.com",
      gender: Gender.FEMALE,
      age: 64,
      diaryCount: 5,
      createdAt: new Date("2025-03-03"),
      risk: {
        isRisk: true,
        reason: "최근 한 달간 일기 작성 빈도 급감",
      },
    },
    {
      id: "5",
      name: "정우성",
      birthDate: "1975.11.12",
      disease: "우울장애",
      role: UserRole.USER,
      email: "jung@example.com",
      gender: Gender.MALE,
      age: 48,
      diaryCount: 62,
      createdAt: new Date("2024-12-10"),
      risk: {
        isRisk: false,
        reason: "",
      },
    },
    {
      id: "6",
      name: "한미경",
      birthDate: "1962.02.18",
      disease: "파킨슨병",
      role: UserRole.USER,
      email: "han@example.com",
      gender: Gender.FEMALE,
      age: 61,
      diaryCount: 14,
      createdAt: new Date("2025-02-20"),
      risk: {
        isRisk: true,
        reason: "최근 설문에서 불안 점수 급상승",
      },
    },
    {
      id: "7",
      name: "오준호",
      birthDate: "1980.09.01",
      disease: "외상 후 스트레스 장애(PTSD)",
      role: UserRole.USER,
      email: "oh@example.com",
      gender: Gender.MALE,
      age: 43,
      diaryCount: 80,
      createdAt: new Date("2024-11-01"),
      risk: {
        isRisk: false,
        reason: "",
      },
    },
    {
      id: "8",
      name: "문지혜",
      birthDate: "1967.04.09",
      disease: "알츠하이머 초기",
      role: UserRole.USER,
      email: "moon@example.com",
      gender: Gender.FEMALE,
      age: 56,
      diaryCount: 19,
      createdAt: new Date("2025-01-28"),
      risk: {
        isRisk: true,
        reason: "보호자 요청으로 모니터링 강화 필요",
      },
    },
  ];

  const selectedUser = users.find((u) => u.id === selectedUserId);

  return (
    <div className="flex h-screen flex-col bg-white">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex flex-1 overflow-hidden">
        {activeTab === "users" ? (
          <>
            <div className="w-80 border-r border-border bg-white">
              <div className="border-b border-border px-6 py-4">
                <h1 className="text-xl font-bold">사용자 관리</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  전체 사용자 목록
                </p>
              </div>
              <UserList
                users={users}
                selectedUserId={selectedUserId}
                onSelectUser={setSelectedUserId}
              />
            </div>

            <div className="flex-1 overflow-auto bg-white">
              {selectedUser ? (
                <UserDetail user={selectedUser} />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  좌측에서 사용자를 선택해주세요
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-auto bg-muted">
            <UsageManagement />
          </div>
        )}
      </div>
    </div>
  );
}
