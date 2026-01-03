"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import {
  DiaryDetailResponse,
  DiaryDetailResponseEmotionEnum,
} from "@/generated-api";
import { diaryApi } from "@/lib/api/client";

import { EMOTION_LABELS, EMOTION_CONFIG } from "@/lib/constants";
import { formatKoreanDate } from "@/utils/date";

export default function DiaryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [diary, setDiary] = useState<DiaryDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    diaryApi
      .findDiaryById({ diaryId: id })
      .then((res) => {
        if (!res.data) {
          router.replace("/diary/list");
          return;
        }
        setDiary(res.data);
      })
      .catch(() => {
        router.replace("/diary/list");
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading || !diary) return null;

  const today = formatKoreanDate(diary.date);
  const emotionConfig =
    EMOTION_CONFIG[diary.emotion as DiaryDetailResponseEmotionEnum];
  const EmotionIcon = emotionConfig.icon;

  return (
    <div className="min-h-screen bg-secondary">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className=" flex h-16 max-w-3xl items-center gap-4 px-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">일기 상세 ({today})</h1>
        </div>
      </header>

      <main className="container max-w-5xl py-8 mx-auto">
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`
        flex h-10 w-10 shrink-0 items-center justify-center rounded-full
        ${emotionConfig.bgColor}
      `}
                >
                  <EmotionIcon className={`h-5 w-5 ${emotionConfig.color}`} />
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    {EMOTION_LABELS[diary.emotion]}
                  </p>
                  <p className="text-sm text-muted-foreground">{today}</p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                일기 내용
              </p>
              <p className="leading-relaxed text-foreground">{diary.content}</p>
            </div>

            <div className="space-y-4 rounded-lg bg-muted p-6">
              <p className="font-medium">생각 정리 점수</p>
              <div className="space-y-3">
                {diary.questionScores.map((q, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {q.questionText}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 rounded-full bg-background">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${(q.score / 10) * 100}%` }}
                        />
                      </div>
                      <p className="w-8 text-right font-semibold text-primary">
                        {q.score}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Link href="/diary/list" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  size="lg"
                >
                  목록으로
                </Button>
              </Link>
              <Link href="/home" className="flex-1">
                <Button className="w-full" size="lg">
                  홈으로
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
