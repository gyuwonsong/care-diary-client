"use client";

import type React from "react";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EmotionSelector } from "@/components/common/emotion-selector";
import { SliderGroup } from "@/components/common/slider-group";

import { type Emotion, REFLECTION_QUESTIONS, UI_TEXT } from "@/lib/constants";
import { formatKoreanDate } from "@/utils/date";
import { SESSION_KEYS } from "@/lib/session-keys";

type DiaryDraft = {
  emotion: Emotion;
  content: string;
  reflections: number[];
  createdAtISO: string;
};

function getLocalTodayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isISODateString(v: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(v);
}

export default function DiaryWriteClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const writingDateISO = useMemo(() => {
    const q = searchParams.get("date");
    if (q && isISODateString(q)) return q;
    return getLocalTodayISO();
  }, [searchParams]);

  const headerDate = useMemo(
    () => formatKoreanDate(new Date(`${writingDateISO}T12:00:00`)),
    [writingDateISO],
  );

  const [step, setStep] = useState<"write" | "reflect">("write");
  const [emotion, setEmotion] = useState<Emotion | null>(null);
  const [content, setContent] = useState("");

  const [reflection1, setReflection1] = useState(5);
  const [reflection2, setReflection2] = useState(5);
  const [reflection3, setReflection3] = useState(5);
  const [reflection4, setReflection4] = useState(5);
  const [reflection5, setReflection5] = useState(5);
  const [reflection6, setReflection6] = useState(5);

  const canProceed =
    step === "write" ? !!emotion && content.trim().length > 0 : true;

  const handleNext = () => {
    if (step === "write") {
      if (!emotion || content.trim().length === 0) return;
      setStep("reflect");
      return;
    }

    if (!emotion) return;

    const draft: DiaryDraft = {
      emotion,
      content: content.trim(),
      reflections: [
        reflection1,
        reflection2,
        reflection3,
        reflection4,
        reflection5,
        reflection6,
      ],
      createdAtISO: writingDateISO,
    };

    sessionStorage.setItem(SESSION_KEYS.DIARY_DRAFT, JSON.stringify(draft));
    router.push("/diary/summary");
  };

  return (
    <div className="min-h-screen bg-secondary">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className=" flex h-16 max-w-3xl items-center gap-4 px-6">
          <Link href="/home">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">
            {step === "write"
              ? `오늘의 일기 (${headerDate})`
              : `생각 정리하기 (${headerDate})`}
          </h1>
        </div>
      </header>

      <main className="container max-w-5xl py-8 mx-auto">
        <div className="rounded-sm border bg-card p-8">
          {step === "write" ? (
            <div className="space-y-8">
              <div>
                <h2 className="mb-6 text-lg font-semibold">
                  {UI_TEXT.DIARY.SELECT_EMOTION}
                </h2>
                <EmotionSelector selected={emotion} onSelect={setEmotion} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="content" className="text-base font-medium">
                    {UI_TEXT.DIARY.WRITE_CONTENT}
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    className="rounded-sm bg-transparent"
                  >
                    추천 질문 보기
                  </Button>
                </div>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="오늘 하루를 자유롭게 기록해보세요 💭"
                  rows={12}
                  className="resize-none rounded-sm text-base leading-relaxed"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">생각 정리하기</h2>
              <SliderGroup
                sliders={[
                  {
                    question: REFLECTION_QUESTIONS[0],
                    value: reflection1,
                    onChange: setReflection1,
                  },
                  {
                    question: REFLECTION_QUESTIONS[1],
                    value: reflection2,
                    onChange: setReflection2,
                  },
                  {
                    question: REFLECTION_QUESTIONS[2],
                    value: reflection3,
                    onChange: setReflection3,
                  },
                  {
                    question: REFLECTION_QUESTIONS[3],
                    value: reflection4,
                    onChange: setReflection4,
                  },
                  {
                    question: REFLECTION_QUESTIONS[4],
                    value: reflection5,
                    onChange: setReflection5,
                  },
                  {
                    question: REFLECTION_QUESTIONS[5],
                    value: reflection6,
                    onChange: setReflection6,
                  },
                ]}
              />
            </div>
          )}

          <div className="mt-8">
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="w-full rounded-sm"
              size="lg"
            >
              {step === "write" ? "다음" : "완료"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
