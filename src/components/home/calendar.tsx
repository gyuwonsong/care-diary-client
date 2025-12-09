"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarProps {
  year: number;
  month: number;
  onMonthChange: (year: number, month: number) => void;
  diaryDates: number[];
  onDateSelect: (date: number | null) => void;
  selectedDate: number | null;
}

export function Calendar({
  year,
  month,
  onMonthChange,
  diaryDates,
  onDateSelect,
  selectedDate,
}: CalendarProps) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month - 1;
  const todayDate = isCurrentMonth ? today.getDate() : null;

  const handlePrevMonth = () => {
    if (month === 1) {
      onMonthChange(year - 1, 12);
    } else {
      onMonthChange(year, month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      onMonthChange(year + 1, 1);
    } else {
      onMonthChange(year, month + 1);
    }
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevMonth}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-base font-semibold">
          {year}년 {month}월
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextMonth}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
        {days.map((day, index) =>
          typeof day === "number" ? (
            <button
              key={index}
              onClick={() => {
                onDateSelect(day);
              }}
              className={`
                flex aspect-square items-center justify-center text-sm transition-colors hover:cursor-pointer
                ${
                  selectedDate === day
                    ? "bg-primary text-primary-foreground font-medium rounded-full hover:bg-white hover:text-primary hover:border hover:border-primary"
                    : diaryDates.includes(day)
                      ? "bg-accent font-medium rounded-full"
                      : todayDate === day
                        ? "text-primary font-semibold hover:bg-accent rounded-full"
                        : "hover:bg-accent rounded-full"
                }
              `}
            >
              {day}
            </button>
          ) : (
            day
          ),
        )}
      </div>
    </div>
  );
}
