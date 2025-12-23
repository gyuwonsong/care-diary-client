"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Emotion, EMOTION_LABELS } from "@/lib/constants";
import { formatKoreanDate } from "@/utils/date";

export default function DiarySummaryPage() {
  const emotion = Emotion.HAPPY;
  const content =
    "오늘은 병원에 다녀왔다. 검사 결과가 좋아서 안심이 되었다. 가족들과 함께 저녁 식사를 하며 즐거운 시간을 보냈다.";
  const reflection1 = 8;
  const reflection2 = 7;
  const reflection3 = 7;
  const reflection4 = 5;
  const reflection5 = 6;
  const reflection6 = 8;
  const date = "2025-10-27   22:49";

  const today = formatKoreanDate(new Date());

  return (
    <div className="min-h-screen bg-secondary">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className=" flex h-16 max-w-3xl items-center gap-4 px-6">
          <Link href="/home">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">오늘의 일기 요약 ({today})</h1>
        </div>
      </header>

      <main className="container max-w-5xl py-8 mx-auto">
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {/* TODO: 공감 요약 요청 멘트 */}
                이번주도 너무 고생하셨어요! ✨
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                내 기분은?
              </p>
              <p className=" font-medium">{EMOTION_LABELS[emotion]}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                일기 내용
              </p>
              <p className="leading-relaxed text-foreground">{content}</p>
            </div>

            <div className="space-y-3 rounded-lg bg-muted p-4">
              <p className="text-sm font-medium">생각 정리 요약</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    내면 표현 정도
                  </p>
                  <p className="font-semibold text-primary">{reflection1}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">슬픔 정도</p>
                  <p className="font-semibold text-primary">{reflection2}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">분노 정도</p>
                  <p className="font-semibold text-primary">{reflection3}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">행복감 정도</p>
                  <p className="font-semibold text-primary">{reflection4}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    일기 작성의 가치·의미
                  </p>
                  <p className="font-semibold text-primary">{reflection5}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    오늘 작성한 일기 점수
                  </p>
                  <p className="font-semibold text-primary">{reflection6}</p>
                </div>
              </div>
            </div>

            <div className="space-y-1 border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground">
                작성 일시
              </p>
              <p className="text-sm">{date}</p>
            </div>

            <Link href="/home" className="block">
              <Button className="w-full" size="lg">
                홈으로 돌아가기
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
