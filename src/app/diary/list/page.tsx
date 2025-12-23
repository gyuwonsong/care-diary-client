"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Emotion, EMOTION_CONFIG, EMOTION_LABELS } from "@/lib/constants";
import { formatKoreanDate } from "@/utils/date";

const diaries = [
  {
    id: "1",
    emotion: Emotion.HAPPY,
    content:
      "오늘은 병원에 다녀왔다. 검사 결과가 좋아서 안심이 되었다. 가족들과 함께 저녁 식사를 하며 즐거운 시간을 보냈다.",
    reflection1: 8,
    reflection2: 7,
    date: "2025-10-27",
    time: "22:49",
  },
  {
    id: "2",
    emotion: Emotion.SAD,
    content:
      "오늘은 몸이 조금 좋지 않았다. 그래도 일기를 쓰면서 마음을 정리해 보았다.",
    reflection1: 6,
    reflection2: 7,
    date: "2025-10-20",
    time: "21:15",
  },
  {
    id: "3",
    emotion: Emotion.SAD,
    content:
      "앞으로의 치료가 잘 될지 걱정이 된다. 의료진을 믿고 차분히 지켜보려고 한다.",
    reflection1: 7,
    reflection2: 8,
    date: "2025-09-30",
    time: "19:30",
  },
];

function getYearMonthKey(dateStr: string) {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = d.getMonth();
  return { year, month };
}

export default function DiaryListPage() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const monthlyDiaries = useMemo(() => {
    return diaries
      .filter((d) => {
        const { year, month } = getYearMonthKey(d.date);
        return year === currentYear && month === currentMonth;
      })
      .sort(
        (a, b) =>
          new Date(b.date + " " + b.time).getTime() -
          new Date(a.date + " " + a.time).getTime(),
      );
  }, [currentYear, currentMonth]);

  const totalPages = Math.max(
    1,
    Math.ceil(monthlyDiaries.length / itemsPerPage),
  );
  const paginatedDiaries = monthlyDiaries.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const handlePrevMonth = () => {
    setPage(1);
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setPage(1);
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const currentMonthLabel = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
  }).format(new Date(currentYear, currentMonth, 1));

  return (
    <div className="min-h-screen bg-secondary">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className=" flex h-16 max-w-3xl items-center gap-4 px-6">
          <Link href="/home">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">일기 목록</h1>
        </div>
      </header>

      <main className="container max-w-5xl py-8 mx-auto space-y-6">
        <section className="flex items-center justify-between rounded-lg bg-muted px-4 py-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{currentMonthLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevMonth}
              aria-label="이전 달"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              aria-label="다음 달"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </section>

        <section className="space-y-3">
          {paginatedDiaries.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                이 달에는 작성된 일기가 없어요.
                <br />
                새로운 일기를 작성해보세요.
              </CardContent>
            </Card>
          ) : (
            paginatedDiaries.map((diary) => {
              const emotionConfig = EMOTION_CONFIG[diary.emotion];
              const EmotionIcon = emotionConfig.icon;
              const formattedDate = formatKoreanDate(new Date(diary.date));

              return (
                <Link key={diary.id} href={`/diary/${diary.id}`}>
                  <Card className="hover:bg-muted/50 transition-colors cursor-pointer mb-4">
                    <CardContent className="flex items-start gap-4 py-2">
                      <div
                        className={`
                          mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full
                          ${emotionConfig.bgColor}
                        `}
                      >
                        <EmotionIcon
                          className={`h-5 w-5 ${emotionConfig.color}`}
                        />
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold">
                            {EMOTION_LABELS[diary.emotion]}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formattedDate} · {diary.time}
                          </p>
                        </div>
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {diary.content}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          )}
        </section>

        {paginatedDiaries.length > 0 && (
          <section className="flex justify-center pt-2">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) setPage((p) => p - 1);
                    }}
                    aria-disabled={page === 1}
                    className={
                      page === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNumber = idx + 1;
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={pageNumber === page}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(pageNumber);
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < totalPages) setPage((p) => p + 1);
                    }}
                    aria-disabled={page === totalPages}
                    className={
                      page === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </section>
        )}
      </main>
    </div>
  );
}
