"use client";

import { useEffect, useMemo, useState } from "react";

import { Navbar } from "@/components/layout/navbar";
import { CalendarSidebar } from "@/components/home/calendar-sidebar";
import { MainContent } from "@/components/home/main-content";

import { diaryApi } from "@/lib/api/client";
import { fetchWithSonner } from "@/lib/api/fetch-with-sonner";
import { getOAuthSession } from "@/lib/auth-storage";

import type { Emotion } from "@/lib/constants";
import type {
  WelfareServiceItem,
  CommonResponseDiaryDatesResponse,
  CommonResponseDiaryFindAllResponse,
} from "@/generated-api";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type UnknownRecord = Record<string, unknown>;

function isRecord(v: unknown): v is UnknownRecord {
  return typeof v === "object" && v !== null;
}

function pickData(res: unknown): unknown {
  if (!isRecord(res)) return undefined;
  if ("data" in res) return res.data;
  if ("result" in res) return res.result;
  return undefined;
}

function extractDiaryDays(res: unknown): number[] {
  const data = pickData(res);

  if (Array.isArray(data)) return normalizeDaysArray(data);

  if (isRecord(data)) {
    const candidates: unknown[] = [];
    if ("dates" in data) candidates.push(data.dates);
    if ("items" in data) candidates.push(data.items);
    if ("list" in data) candidates.push(data.list);

    for (const c of candidates) {
      if (Array.isArray(c)) return normalizeDaysArray(c);
    }
  }

  return [];
}

function normalizeDaysArray(arr: unknown[]): number[] {
  const days: number[] = [];

  for (const v of arr) {
    if (typeof v === "number" && Number.isFinite(v)) {
      if (v >= 1 && v <= 31) days.push(v);
      continue;
    }
    if (typeof v === "string") {
      const maybe = v.includes("-") ? v.slice(-2) : v;
      const n = Number(maybe);
      if (Number.isFinite(n) && n >= 1 && n <= 31) days.push(n);
    }
  }

  return Array.from(new Set(days)).sort((a, b) => a - b);
}

type DiaryPreview = {
  id: string;
  emotion: string;
  content: string;
  date: string;
};

function extractDiaryPreviews(res: unknown): DiaryPreview[] {
  const data = pickData(res);

  if (Array.isArray(data)) return previewsFromList(data);

  if (isRecord(data)) {
    const candidates: unknown[] = [];
    if ("items" in data) candidates.push(data.items);
    if ("diaries" in data) candidates.push(data.diaries);
    if ("list" in data) candidates.push(data.list);

    for (const c of candidates) {
      if (Array.isArray(c)) return previewsFromList(c);
    }
  }

  return [];
}

function previewsFromList(list: unknown[]): DiaryPreview[] {
  const out: DiaryPreview[] = [];

  for (const item of list) {
    if (!isRecord(item)) continue;

    const id =
      typeof item.diaryId === "string"
        ? item.diaryId
        : typeof item.id === "string"
          ? item.id
          : typeof item.diaryId === "number"
            ? String(item.diaryId)
            : typeof item.id === "number"
              ? String(item.id)
              : "";

    if (!id) continue;

    const emotion =
      typeof item.emotion === "string"
        ? item.emotion
        : typeof item.emotionLabel === "string"
          ? item.emotionLabel
          : "";

    const content =
      typeof item.contentPreview === "string"
        ? item.contentPreview
        : typeof item.content === "string"
          ? item.content
          : "";

    const date =
      typeof item.date === "string"
        ? item.date
        : typeof item.createdAt === "string"
          ? item.createdAt
          : "";

    out.push({ id, emotion, content, date });
  }

  return out;
}

function ymString(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

function ymdString(year: number, month: number, day: number): string {
  return `${ymString(year, month)}-${String(day).padStart(2, "0")}`;
}

function localDateFromYMD(ymd: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!m) return null;
  const y = Number(m[1]);
  const mm = Number(m[2]);
  const d = Number(m[3]);
  return new Date(y, mm - 1, d, 12, 0, 0);
}

type HomeResponseBE = {
  monthlyDiaryCount: number;
  yearlyDiaryCount: number;
  emotionCounts: Record<string, number>;
  recommendedWelfareServices: WelfareServiceItem[];
  termCount: number;
  scaleQuestionRequired: boolean;
};

function isHomeResponseBE(v: unknown): v is HomeResponseBE {
  return (
    isRecord(v) &&
    typeof v.monthlyDiaryCount === "number" &&
    typeof v.yearlyDiaryCount === "number" &&
    isRecord(v.emotionCounts) &&
    Array.isArray(v.recommendedWelfareServices) &&
    typeof v.termCount === "number" &&
    typeof v.scaleQuestionRequired === "boolean"
  );
}

export default function HomePage() {
  const today = useMemo(() => new Date(), []);

  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const [diaryDates, setDiaryDates] = useState<number[]>([]);

  const [monthCount, setMonthCount] = useState<number>(0);
  const [yearCount, setYearCount] = useState<number>(0);
  const [emotionCounts, setEmotionCounts] = useState<Record<string, number>>(
    {},
  );
  const [recommended, setRecommended] = useState<WelfareServiceItem[]>([]);
  const [isScaleQuestionRequired, setIsScaleQuestionRequired] =
    useState<boolean>(false);
  const [termCount, setTermCount] = useState<number>(0);

  const [diaryEntries, setDiaryEntries] = useState<DiaryPreview[]>([]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const { token } = getOAuthSession();

        const res = await fetchWithSonner(`${API_BASE}/v1/home`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token ?? ""}`,
          },
        });

        const json = (await res.json()) as unknown;
        if (!alive) return;

        const data = isRecord(json) ? json.data : undefined;

        if (isHomeResponseBE(data)) {
          setMonthCount(data.monthlyDiaryCount);
          setYearCount(data.yearlyDiaryCount);
          setEmotionCounts(data.emotionCounts);
          setRecommended(data.recommendedWelfareServices);
          setTermCount(data.termCount);
          setIsScaleQuestionRequired(data.scaleQuestionRequired);
        } else {
          setMonthCount(0);
          setYearCount(0);
          setEmotionCounts({});
          setRecommended([]);
          setTermCount(0);
          setIsScaleQuestionRequired(false);
        }
      } catch {
        if (!alive) return;
        setMonthCount(0);
        setYearCount(0);
        setEmotionCounts({});
        setRecommended([]);
        setTermCount(0);
        setIsScaleQuestionRequired(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res: CommonResponseDiaryDatesResponse = await diaryApi.findDates({
          month: ymString(year, month),
        });

        const days = extractDiaryDays(res);
        if (!alive) return;
        setDiaryDates(days);
      } catch {
        if (!alive) return;
        setDiaryDates([]);
      }
    })();

    return () => {
      alive = false;
    };
  }, [year, month]);

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!selectedDate) {
        setDiaryEntries([]);
        return;
      }

      if (!diaryDates.includes(selectedDate)) {
        setDiaryEntries([]);
        return;
      }

      try {
        const dateStr = ymdString(year, month, selectedDate);
        const d = localDateFromYMD(dateStr);
        if (!d) {
          setDiaryEntries([]);
          return;
        }

        const res: CommonResponseDiaryFindAllResponse =
          await diaryApi.findAllDiariesByMe({
            startDate: d,
            endDate: d,
          });

        const previews = extractDiaryPreviews(res);
        if (!alive) return;
        setDiaryEntries(previews);
      } catch {
        if (!alive) return;
        setDiaryEntries([]);
      }
    })();

    return () => {
      alive = false;
    };
  }, [selectedDate, diaryDates, year, month]);

  const handleMonthChange = (newYear: number, newMonth: number) => {
    setYear(newYear);
    setMonth(newMonth);
    setSelectedDate(null);
    setDiaryEntries([]);
  };

  const handleDateSelect = (date: number | null) => {
    setSelectedDate((prev) => (prev === date ? null : date));
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
            emotionCounts={emotionCounts as unknown as Record<Emotion, number>}
            selectedDate={selectedDate}
          />
        </aside>

        <div className="w-4/5 bg-muted px-12 py-6">
          <MainContent
            selectedDate={selectedDate}
            year={year}
            month={month}
            diaryEntries={diaryEntries}
            shouldTakeSessionSurvey={isScaleQuestionRequired}
            todayQuestion={null}
            recommended={recommended.map((x) => ({
              title:
                typeof (x as unknown as { title?: unknown }).title === "string"
                  ? (x as unknown as { title: string }).title
                  : typeof (x as unknown as { name?: unknown }).name ===
                      "string"
                    ? (x as unknown as { name: string }).name
                    : "추천 서비스",
              url:
                typeof (x as unknown as { url?: unknown }).url === "string"
                  ? (x as unknown as { url: string }).url
                  : undefined,
            }))}
          />
        </div>
      </main>
    </div>
  );
}
