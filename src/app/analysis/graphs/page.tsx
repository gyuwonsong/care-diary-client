"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LineChart } from "@/components/common/line-chart";
import { ScaleType, SCALE_LABELS } from "@/lib/constants";

export default function AnalysisGraphsPage() {
  const anxietyData = [
    { session: 1, score: 65 },
    { session: 2, score: 58 },
    { session: 3, score: 52 },
    { session: 4, score: 48 },
    { session: 5, score: 45 },
    { session: 6, score: 42 },
    { session: 7, score: 38 },
    { session: 8, score: 35 },
  ];

  const depressionData = [
    { session: 1, score: 72 },
    { session: 2, score: 68 },
    { session: 3, score: 62 },
    { session: 4, score: 55 },
    { session: 5, score: 52 },
    { session: 6, score: 48 },
    { session: 7, score: 45 },
    { session: 8, score: 40 },
  ];

  const angerData = [
    { session: 1, score: 55 },
    { session: 2, score: 52 },
    { session: 3, score: 48 },
    { session: 4, score: 50 },
    { session: 5, score: 45 },
    { session: 6, score: 42 },
    { session: 7, score: 38 },
    { session: 8, score: 35 },
  ];

  return (
    <div className="min-h-screen bg-muted">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className=" flex h-16 max-w-3xl items-center gap-4 px-6">
          <Link href="/admin/users">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">설문 통계 확인</h1>
        </div>
      </header>

      <main className="container max-w-5xl py-8 pb-10 mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            김철수님의 차수별 설문 척도 변화
          </h2>
          <p className="text-sm text-muted-foreground">
            불안, 우울, 분노 척도의 차수별 추이를 확인하세요
          </p>
        </div>

        <div className="space-y-6">
          <LineChart
            title={`${SCALE_LABELS[ScaleType.ANXIETY]} 척도`}
            data={anxietyData}
            color="#f59e0b"
          />
          <LineChart
            title={`${SCALE_LABELS[ScaleType.DEPRESSION]} 척도`}
            data={depressionData}
            color="#3b82f6"
          />
          <LineChart
            title={`${SCALE_LABELS[ScaleType.ANGER]} 척도`}
            data={angerData}
            color="#ef4444"
          />
        </div>

        <div className="mt-8 rounded-sm border bg-card p-6">
          <h3 className="mb-6 text-lg font-semibold">분석 요약</h3>
          <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              •{" "}
              <span className="font-medium text-foreground">
                {SCALE_LABELS[ScaleType.ANXIETY]} 척도
              </span>
              : 1차수 65점에서 8차수 35점으로 약 46% 감소했습니다.
            </p>
            <p>
              •{" "}
              <span className="font-medium text-foreground">
                {SCALE_LABELS[ScaleType.DEPRESSION]} 척도
              </span>
              : 1차수 72점에서 8차수 40점으로 약 44% 감소했습니다.
            </p>
            <p>
              •{" "}
              <span className="font-medium text-foreground">
                {SCALE_LABELS[ScaleType.ANGER]} 척도
              </span>
              : 1차수 55점에서 8차수 35점으로 약 36% 감소했습니다.
            </p>
            <blockquote className="mt-4 border-l-2 border-primary pl-4 text-primary font-semibold">
              전반적으로 모든 척도에서 긍정적인 변화가 관찰되고 있습니다.
              지속적인 일기 작성과 돌봄 활동이 효과적으로 작용하고 있습니다.
            </blockquote>
          </div>
        </div>
      </main>
    </div>
  );
}
