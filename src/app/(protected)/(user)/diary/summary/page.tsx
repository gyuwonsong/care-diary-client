"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  EMOTION_LABELS,
  REFLECTION_QUESTIONS,
  type Emotion,
} from "@/lib/constants";
import { formatKoreanDate } from "@/utils/date";
import { SESSION_KEYS } from "@/lib/session-keys";

import { diaryApi } from "@/lib/api/client";
import type {
  DiaryCreateRequest,
  CommonResponseDiaryCreateResponse,
  QuestionScoreItem,
} from "@/generated-api";
import {
  DiaryCreateRequestEmotionEnum,
  instanceOfDiaryCreateResponse,
} from "@/generated-api";

type DiaryDraft = {
  emotion: Emotion;
  content: string;
  reflections: number[];
  createdAtISO: string;
};

type DiaryResult = {
  summary: string;
};

type UnknownRecord = Record<string, unknown>;

function isoDateToUtcNoon(dateISO: string): Date {
  const [y, m, d] = dateISO.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
}

function isRecord(v: unknown): v is UnknownRecord {
  return typeof v === "object" && v !== null;
}

function pickData(res: unknown): unknown {
  if (!isRecord(res)) return undefined;
  if ("data" in res) return res.data;
  if ("result" in res) return res.result;
  return undefined;
}

function clampScore(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(10, Math.round(n)));
}

function buildQuestionScores(reflections: number[]): QuestionScoreItem[] {
  return REFLECTION_QUESTIONS.map((questionText, i) => ({
    questionText,
    score: clampScore(Number(reflections[i] ?? 0)),
  }));
}

function mapEmotionToApi(
  emotion: Emotion,
): DiaryCreateRequest["emotion"] | null {
  if (emotion === DiaryCreateRequestEmotionEnum.Happy)
    return DiaryCreateRequestEmotionEnum.Happy;
  if (emotion === DiaryCreateRequestEmotionEnum.Love)
    return DiaryCreateRequestEmotionEnum.Love;
  if (emotion === DiaryCreateRequestEmotionEnum.Sad)
    return DiaryCreateRequestEmotionEnum.Sad;
  return null;
}

function LoadingView({ today }: { today: string }) {
  return (
    <div className="min-h-screen bg-secondary">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 max-w-3xl items-center gap-4 px-6">
          <Link href="/home">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">오늘의 일기 요약 ({today})</h1>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
        <Card className="w-full max-w-xl border-0">
          <CardHeader>
            <CardTitle className="text-lg">
              오늘의 일기를 정리하고 있어요 ✨
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                AI가 요약을 생성 중이에요. 잠시만 기다려 주세요.
              </p>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse bg-muted rounded-sm" />
              <div className="h-4 w-11/12 animate-pulse bg-muted rounded-sm" />
              <div className="h-4 w-10/12 animate-pulse bg-muted rounded-sm" />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function DiarySummaryPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<DiaryDraft | null>(null);
  const [summary, setSummary] = useState("");

  const headerDate = formatKoreanDate(
    draft?.createdAtISO ? new Date(draft.createdAtISO) : new Date(),
  );

  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const goWrite = () => {
      setLoading(false);
      router.replace("/diary/write");
    };

    const readResult = (): DiaryResult | null => {
      const raw = sessionStorage.getItem(SESSION_KEYS.DIARY_RESULT);
      if (!raw) return null;
      try {
        const parsed = JSON.parse(raw) as unknown;
        if (isRecord(parsed) && typeof parsed.summary === "string") {
          return { summary: parsed.summary };
        }
        return null;
      } catch {
        return null;
      }
    };

    const existingResult = readResult();
    if (existingResult) {
      const rawDraft = sessionStorage.getItem(SESSION_KEYS.DIARY_DRAFT);
      if (rawDraft) {
        try {
          const parsed = JSON.parse(rawDraft) as unknown;
          if (
            isRecord(parsed) &&
            typeof parsed.emotion === "string" &&
            typeof parsed.content === "string" &&
            Array.isArray(parsed.reflections) &&
            typeof parsed.createdAtISO === "string"
          ) {
            setDraft({
              emotion: parsed.emotion as Emotion,
              content: parsed.content,
              reflections: parsed.reflections.map((n) => clampScore(Number(n))),
              createdAtISO: parsed.createdAtISO,
            });
          }
        } catch {}
      }
      setSummary(existingResult.summary);
      setLoading(false);
      sessionStorage.removeItem(SESSION_KEYS.DIARY_RESULT);
      sessionStorage.removeItem(SESSION_KEYS.DIARY_DRAFT);
      sessionStorage.removeItem(SESSION_KEYS.DIARY_CREATING);
      return;
    }

    const creating =
      sessionStorage.getItem(SESSION_KEYS.DIARY_CREATING) === "1";
    if (creating) {
      const t = setInterval(() => {
        const r = readResult();
        if (r) {
          clearInterval(t);
          setSummary(r.summary);
          setLoading(false);
          sessionStorage.removeItem(SESSION_KEYS.DIARY_RESULT);
          sessionStorage.removeItem(SESSION_KEYS.DIARY_DRAFT);
          sessionStorage.removeItem(SESSION_KEYS.DIARY_CREATING);
        }
      }, 150);

      const timeout = setTimeout(() => {
        clearInterval(t);
        sessionStorage.removeItem(SESSION_KEYS.DIARY_CREATING);
        goWrite();
      }, 8000);

      return () => clearTimeout(timeout);
    }

    (async () => {
      try {
        const raw = sessionStorage.getItem(SESSION_KEYS.DIARY_DRAFT);
        if (!raw) {
          goWrite();
          return;
        }

        const parsed = JSON.parse(raw) as unknown;
        if (
          !isRecord(parsed) ||
          typeof parsed.emotion !== "string" ||
          typeof parsed.content !== "string" ||
          !Array.isArray(parsed.reflections) ||
          typeof parsed.createdAtISO !== "string"
        ) {
          goWrite();
          return;
        }

        const nextDraft: DiaryDraft = {
          emotion: parsed.emotion as Emotion,
          content: parsed.content,
          reflections: parsed.reflections.map((n) => clampScore(Number(n))),
          createdAtISO: parsed.createdAtISO,
        };

        const apiEmotion = mapEmotionToApi(nextDraft.emotion);
        if (!apiEmotion) {
          goWrite();
          return;
        }

        setDraft(nextDraft);
        sessionStorage.setItem(SESSION_KEYS.DIARY_CREATING, "1");

        const diaryCreateRequest: DiaryCreateRequest = {
          date: isoDateToUtcNoon(nextDraft.createdAtISO),
          emotion: apiEmotion,
          content: nextDraft.content,
          questionScores: buildQuestionScores(nextDraft.reflections),
        };

        const res: CommonResponseDiaryCreateResponse =
          await diaryApi.createDiary({
            diaryCreateRequest,
          });

        const data = pickData(res);

        if (isRecord(data) && instanceOfDiaryCreateResponse(data)) {
          sessionStorage.setItem(
            SESSION_KEYS.DIARY_RESULT,
            JSON.stringify({ summary: data.summary }),
          );

          setSummary(data.summary);
          setLoading(false);

          sessionStorage.removeItem(SESSION_KEYS.DIARY_DRAFT);
          sessionStorage.removeItem(SESSION_KEYS.DIARY_CREATING);
          sessionStorage.removeItem(SESSION_KEYS.DIARY_RESULT);
          return;
        }

        sessionStorage.removeItem(SESSION_KEYS.DIARY_CREATING);
        goWrite();
      } catch {
        sessionStorage.removeItem(SESSION_KEYS.DIARY_CREATING);
        goWrite();
      }
    })();
  }, [router]);

  if (loading) return <LoadingView today={headerDate} />;
  if (!draft) return null;

  const [
    reflection1,
    reflection2,
    reflection3,
    reflection4,
    reflection5,
    reflection6,
  ] = draft.reflections;

  return (
    <div className="min-h-screen bg-secondary">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 max-w-3xl items-center gap-4 px-6">
          <Link href="/home">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">오늘의 일기 요약 ({headerDate})</h1>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl py-8">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">
              {summary || "이번 주도 정말 수고하셨어요 ✨"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                내 기분은?
              </p>
              <p className="font-medium">{EMOTION_LABELS[draft.emotion]}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                일기 내용
              </p>
              <p className="leading-relaxed text-foreground">{draft.content}</p>
            </div>

            <div className="space-y-3 rounded-lg bg-muted p-4">
              <p className="text-sm font-medium">생각 정리 요약</p>
              <div className="space-y-2">
                <Row label="내면 표현 정도" value={reflection1} />
                <Row label="슬픔 정도" value={reflection2} />
                <Row label="분노 정도" value={reflection3} />
                <Row label="행복감 정도" value={reflection4} />
                <Row label="일기 작성의 가치·의미" value={reflection5} />
                <Row label="오늘 작성한 일기 점수" value={reflection6} />
              </div>
            </div>

            <div className="space-y-1 border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground">
                작성 일시
              </p>
              <p className="text-sm">{draft.createdAtISO}</p>
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

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-semibold text-primary">{value}</p>
    </div>
  );
}
