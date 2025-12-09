"use client";

import { Calendar } from "@/components/home/calendar";
import { StatsSection } from "@/components/home/stats-section";
import type { Emotion } from "@/lib/constants";

interface CalendarSidebarProps {
  year: number;
  month: number;
  onMonthChange: (year: number, month: number) => void;
  onDateSelect: (date: number | null) => void;
  diaryDates: number[];
  monthCount: number;
  yearCount: number;
  emotionCounts: Record<Emotion, number>;
  selectedDate: number | null;
}

export function CalendarSidebar({
  year,
  month,
  onMonthChange,
  onDateSelect,
  diaryDates,
  monthCount,
  yearCount,
  emotionCounts,
  selectedDate,
}: CalendarSidebarProps) {
  return (
    <div className="flex flex-col gap-6 px-6">
      <Calendar
        year={year}
        month={month}
        onMonthChange={onMonthChange}
        diaryDates={diaryDates}
        onDateSelect={onDateSelect}
        selectedDate={selectedDate}
      />

      <StatsSection
        monthCount={monthCount}
        yearCount={yearCount}
        emotionCounts={emotionCounts}
      />
    </div>
  );
}
