"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { CalendarSidebar } from "@/components/home/calendar-sidebar";
import { MainContent } from "@/components/home/main-content";
import { Emotion } from "@/lib/constants";

export default function HomePage() {
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(10);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const diaryDates = [7, 10, 22];
  const monthCount = 10;
  const yearCount = 110;
  const emotionCounts = {
    [Emotion.HAPPY]: 5,
    [Emotion.LOVE]: 3,
    [Emotion.SAD]: 2,
  };

  const mockDiaryEntries: Record<
    number,
    {
      id: string;
      emotion: string;
      content: string;
      date: string;
    }
  > = {
    7: {
      id: "1",
      emotion: "행복",
      content: `오늘은 정말 기분 좋은 하루였어요. 

아침에 일어나서 창밖을 보니 날씨가 너무 좋았고, 가족들과 함께 맛있는 식사를 했습니다. 

오후에는 친구들을 만나서 오랜만에 즐거운 시간을 보냈어요.`,
      date: `${year}-${month.toString().padStart(2, "0")}-07`,
    },
    10: {
      id: "2",
      emotion: "사랑",
      content: `오늘은 가족들과 함께 시간을 보냈습니다.

서로를 돌보고 이야기를 나누면서 정말 행복했어요.`,
      date: `${year}-${month.toString().padStart(2, "0")}-10`,
    },
    22: {
      id: "3",
      emotion: "슬픔",
      content: `오늘은 조금 힘든 하루였습니다.

하지만 내일은 더 나아질 거라 믿어요.`,
      date: `${year}-${month.toString().padStart(2, "0")}-22`,
    },
  };

  const mockDiaryEntry =
    selectedDate && diaryDates.includes(selectedDate)
      ? mockDiaryEntries[selectedDate]
      : undefined;

  const handleMonthChange = (newYear: number, newMonth: number) => {
    setYear(newYear);
    setMonth(newMonth);
    setSelectedDate(null);
  };

  const handleDateSelect = (date: number | null) => {
    if (selectedDate === date) {
      setSelectedDate(null);
    } else {
      setSelectedDate(date);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="flex min-h-[calc(100vh-4rem)]">
        <aside className="w-1/5 border-r border-border bg-white py-6">
          <CalendarSidebar
            year={year}
            month={month}
            onMonthChange={handleMonthChange}
            onDateSelect={handleDateSelect}
            diaryDates={diaryDates}
            monthCount={monthCount}
            yearCount={yearCount}
            emotionCounts={emotionCounts}
            selectedDate={selectedDate}
          />
        </aside>

        <div className="w-4/5 bg-muted px-12 py-6">
          <MainContent
            selectedDate={selectedDate}
            year={year}
            month={month}
            diaryEntry={mockDiaryEntry}
          />
        </div>
      </main>
    </div>
  );
}
