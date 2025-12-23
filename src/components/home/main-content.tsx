"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, List, ExternalLink, CircleCheckBig } from "lucide-react";
import Link from "next/link";
import { UI_TEXT } from "@/lib/constants";

interface MainContentProps {
  selectedDate: number | null;
  year: number;
  month: number;
  diaryEntry?: {
    id: string;
    emotion: string;
    content: string;
    date: string;
  };
}

function getCurrentWeekText(): string {
  const now = new Date();
  const month = now.getMonth() + 1;
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const dayOfMonth = now.getDate();

  const firstDayOfWeek = firstDay.getDay();
  const weekOfMonth = Math.ceil((dayOfMonth + firstDayOfWeek) / 7);

  const weekLabels = ["첫째", "둘째", "셋째", "넷째", "다섯째"];
  const weekLabel = weekLabels[weekOfMonth - 1] || `${weekOfMonth}`;

  return `${month}월 ${weekLabel}주`;
}

export function MainContent({
  selectedDate,
  year,
  month,
  diaryEntry,
}: MainContentProps) {
  const currentWeekText = getCurrentWeekText();

  // TODO: API/조건으로 교체 (true면 참여 가능/필요)
  const shouldTakeSessionSurvey = true;

  const renderTopActions = () => (
    <div className="flex items-center justify-between">
      <div className="flex gap-3">
        <Button variant="outline" className="gap-2 rounded-sm" asChild>
          <Link href="/diary/write">
            <Plus className="h-4 w-4" />
            {currentWeekText} 일기 작성
          </Link>
        </Button>

        <Button variant="outline" className="gap-2 rounded-sm" asChild>
          <Link href="/diary/list">
            <List className="h-4 w-4" />
            일기 목록 보기
          </Link>
        </Button>
      </div>

      {shouldTakeSessionSurvey && (
        <Button className="gap-2 rounded-sm" asChild>
          <Link href="/survey">
            <CircleCheckBig className="h-4 w-4" />
            정기 설문 참여
          </Link>
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {renderTopActions()}

      {selectedDate && diaryEntry ? (
        <>
          <div>
            <h1 className="text-2xl font-bold">
              {year}년 {month}월 {selectedDate}일의 일기
            </h1>
          </div>

          <div className="space-y-6 rounded-sm border border-border bg-card p-8">
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                감정
              </p>
              <p>{diaryEntry.emotion}</p>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                내용
              </p>
              <p>{diaryEntry.content}</p>
            </div>

            <Link href={`/diary/${diaryEntry.id}`}>
              <Button className="w-full rounded-sm" size="lg">
                전체 내용 보기
              </Button>
            </Link>
          </div>
        </>
      ) : selectedDate && !diaryEntry ? (
        <div className="flex items-center justify-center rounded-sm border border-border bg-card p-8">
          <div className="text-center w-full">
            <p className="mb-6 text-muted-foreground">
              {year}년 {month}월 {selectedDate}일에 작성한 일기가 없습니다.
            </p>
            <Link href="/diary/write">
              <Button className="gap-2 rounded-sm w-full" size="lg">
                <Plus className="h-5 w-5" />
                일기 작성하기
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-4 rounded-sm border border-border bg-card p-8">
            <h2 className="text-lg font-semibold">
              {/* TODO: 오늘의 질문 1회기 당 1개 씩 */}
              {UI_TEXT.HOME.TODAY_QUESTION}
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              오늘 하루 중 가장 기억에 남는 순간은 무엇인가요? 그 순간을
              떠올리면 어떤 감정이 느껴지나요?
            </p>
            <Link href="/diary/write">
              <Button className="w-full gap-2 rounded-sm" size="lg">
                <Plus className="h-5 w-5" />
                일기 작성하기
              </Button>
            </Link>
          </div>

          <div className="space-y-4 rounded-sm border border-border bg-card p-8">
            <h2 className="text-lg font-semibold">
              {UI_TEXT.HOME.RECOMMENDED}
            </h2>

            <div className="space-y-2">
              <Card className="border-border rounded-sm hover:bg-accent/50 transition-colors">
                <CardContent className="flex items-center justify-between px-6">
                  <span className="font-medium">심리 상담 서비스</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-sm bg-primary/10 hover:bg-primary/20"
                  >
                    <ExternalLink className="h-4 w-4 text-primary" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border rounded-sm hover:bg-accent/50 transition-colors">
                <CardContent className="flex items-center justify-between px-6">
                  <span className="font-medium">감정 관리 가이드</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-sm bg-primary/10 hover:bg-primary/20"
                  >
                    <ExternalLink className="h-4 w-4 text-primary" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border rounded-sm hover:bg-accent/50 transition-colors">
                <CardContent className="flex items-center justify-between px-6">
                  <span className="font-medium">돌봄 커뮤니티</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-sm bg-primary/10 hover:bg-primary/20"
                  >
                    <ExternalLink className="h-4 w-4 text-primary" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
