"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const mockAnalysisDetail = {
  id: "A001",
  patientId: "P001",
  patientName: "김환자",
  patientDiagnosis: "우울증",
  patientAge: 45,
  patientGender: "F" as "M" | "F",
  analysisNumber: "AN-2024-001",
  createdDate: "2024-05-23 10:00",
  analysisDate: "2024-05-23 14:30",
  summary:
    "환자의 SDoH 분석 결과, 건강 안전 사회 서비스 체계에서 적절한 건강서비스 부재가 확인되었습니다. 특히 건강서비스에 대한 규정적 장애와 건강서비스에 대한 접근성 부족이 주요 문제로 나타났습니다.",
  detailedResult: `분석 상세 결과:

1. 건강 안전 사회 서비스 체계 (8101-8109)
   - 적절한 건강서비스 부재 (8101): 심각성 5, 지속기간 2개월
   - 건강서비스에 대한 규정적 장애 (8102): 심각성 4, 지속기간 1개월
   - 건강서비스에 대한 접근성 부족 (8103): 심각성 3, 지속기간 3개월

2. 안전 (8201-8207)
   - 이웃에서 폭력이나 범죄 (8201): 심각성 2, 지속기간 지속적
   - 안전하지 못한 직업환경 (8202): 심각성 3, 지속기간 6개월

3. 사회서비스 (8301-8305)
   - 적절한 사회서비스 부재 (8301): 심각성 4, 지속기간 2개월
   - 사회서비스에 대한 규정적 장애 (8302): 심각성 3, 지속기간 1개월

권고사항:
- 건강서비스 접근성 개선을 위한 지역사회 자원 연계
- 안전한 주거환경 확보를 위한 사회복지 서비스 연결
- 정기적인 건강상태 모니터링 및 사례관리 필요`,
};

export default function AnalysisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [analysis] = useState(mockAnalysisDetail);

  return (
    <div className="min-h-screen bg-background w-full overflow-auto">
      <div className="container mx-auto p-8">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <Link href="/admin/analysis-management">
                <Button variant="ghost" size="sm" className="rounded-sm p-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-foreground">
                  분석 결과 상세보기
                </h1>
                <p className="text-muted-foreground">
                  분석 번호: {analysis.analysisNumber}
                </p>
              </div>
            </div>

            <div className="flex flex-col text-sm text-muted-foreground text-right self-end md:self-auto">
              <p>작성일시: {analysis.createdDate}</p>
              <p>분석일시: {analysis.analysisDate}</p>
            </div>
          </div>

          <Card className="rounded-sm shadow-sm bg-muted">
            <CardHeader>
              <CardTitle className="text-lg">대상자 기본정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6 pb-3">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    환자 ID
                  </div>
                  <div className="text-base">{analysis.patientId}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    진단명
                  </div>
                  <div className="text-base">{analysis.patientDiagnosis}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    환자명
                  </div>
                  <div className="text-base">{analysis.patientName}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    나이
                  </div>
                  <div className="text-base">{analysis.patientAge}세</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    성별
                  </div>
                  <div className="text-base">
                    {analysis.patientGender === "M" ? "남성" : "여성"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-sm shadow-sm bg-muted">
            <CardHeader>
              <CardTitle className="text-lg">
                사용자에게 제공한 분석 요약
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-white rounded-sm border">
                <p className="text-sm leading-relaxed">{analysis.summary}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-sm shadow-sm bg-muted">
            <CardHeader>
              <CardTitle className="text-lg">
                상세 결과 (LLM 전체 출력)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-white rounded-sm border">
                <code className="text-sm leading-relaxed whitespace-pre-wrap font-mono">
                  {analysis.detailedResult}
                </code>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
