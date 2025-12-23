"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  ScaleType,
  SCALE_LABELS,
  anxietyQuestions,
  depressionQuestions,
  angerQuestions,
} from "@/lib/constants";

const SCALE_OPTIONS = [
  "전혀 아니다",
  "가끔 그렇다",
  "자주 그렇다",
  "거의 언제나 그렇다",
] as const;

const SURVEY_GUIDE_TEXT: Record<ScaleType, string> = {
  [ScaleType.ANXIETY]:
    "다음은 귀하의 감정 상태를 이해하기 위한 설문입니다. 아래의 항목을 읽어보시고, 지난 일주일 동안 귀하가 경험한 감정과 가장 가까운 해당란에 체크해 주시기 바랍니다. 응답하실 때, 너무 오랫동안 생각하지 마십시오. 깊이 생각하시는 것보다 바로 떠오르는 답이 더 정확한 것일 수 있습니다.",
  [ScaleType.DEPRESSION]:
    "다음은 귀하의 우울 정도에 대한 사항을 체크하기 위한 것입니다. 최근 일주일 간 환자가 느끼고 행동한 것을 가장 잘 나타낸다고 생각되는 문항의 칸에 체크하여 주시기 바랍니다.",
  [ScaleType.ANGER]:
    "지난 일주일 동안 무엇을 하며 지냈는지, 어떤 경험을 했는지를 생각해 주십시오. 이후, 다음에 제시되는 감정들을 얼마나 자주 느꼈는지 해당하는 곳에 표시하여 주시기 바랍니다.",
};

export type SurveyMode = "register" | "session";

export type SurveyResultPayload = {
  anxietyAnswers: number[];
  depressionAnswers: number[];
  angerAnswers: number[];
};

interface SurveyFormProps {
  mode: SurveyMode;
  onComplete: (payload: SurveyResultPayload) => void;
  initialScale?: ScaleType;
}

// TODO: 설문 문항 및 항목 BE 요청 (회원가입 시 / 8회기가 지난 플래그가 True일 시)
export function SurveyForm({
  mode,
  onComplete,
  initialScale = ScaleType.ANXIETY,
}: SurveyFormProps) {
  const [currentSurvey, setCurrentSurvey] = useState<ScaleType>(initialScale);

  const [anxietyAnswers, setAnxietyAnswers] = useState<number[]>(
    Array(anxietyQuestions.length).fill(0),
  );
  const [depressionAnswers, setDepressionAnswers] = useState<number[]>(
    Array(depressionQuestions.length).fill(0),
  );
  const [angerAnswers, setAngerAnswers] = useState<number[]>(
    Array(angerQuestions.length).fill(0),
  );

  const getCurrentQuestions = () => {
    switch (currentSurvey) {
      case ScaleType.ANXIETY:
        return anxietyQuestions;
      case ScaleType.DEPRESSION:
        return depressionQuestions;
      case ScaleType.ANGER:
        return angerQuestions;
    }
  };

  const getCurrentAnswers = () => {
    switch (currentSurvey) {
      case ScaleType.ANXIETY:
        return anxietyAnswers;
      case ScaleType.DEPRESSION:
        return depressionAnswers;
      case ScaleType.ANGER:
        return angerAnswers;
    }
  };

  const setCurrentAnswer = (index: number, value: number) => {
    switch (currentSurvey) {
      case ScaleType.ANXIETY: {
        const next = [...anxietyAnswers];
        next[index] = value;
        setAnxietyAnswers(next);
        break;
      }
      case ScaleType.DEPRESSION: {
        const next = [...depressionAnswers];
        next[index] = value;
        setDepressionAnswers(next);
        break;
      }
      case ScaleType.ANGER: {
        const next = [...angerAnswers];
        next[index] = value;
        setAngerAnswers(next);
        break;
      }
    }
  };

  const isCurrentSurveyComplete = () => {
    const answers = getCurrentAnswers();
    return answers.every((answer) => answer > 0);
  };

  const getProgress = () => {
    switch (currentSurvey) {
      case ScaleType.ANXIETY:
        return 33;
      case ScaleType.DEPRESSION:
        return 66;
      case ScaleType.ANGER:
        return 100;
    }
  };

  const handleNext = () => {
    if (currentSurvey === ScaleType.ANXIETY) {
      setCurrentSurvey(ScaleType.DEPRESSION);
    } else if (currentSurvey === ScaleType.DEPRESSION) {
      setCurrentSurvey(ScaleType.ANGER);
    } else {
      onComplete({ anxietyAnswers, depressionAnswers, angerAnswers });
    }
  };

  const handleBack = () => {
    if (currentSurvey === ScaleType.DEPRESSION) {
      setCurrentSurvey(ScaleType.ANXIETY);
    } else if (currentSurvey === ScaleType.ANGER) {
      setCurrentSurvey(ScaleType.DEPRESSION);
    }
  };

  const questions = getCurrentQuestions();
  const answers = getCurrentAnswers();

  const MODE_BADGE = {
    register: { label: "회원가입 설문", sub: "초기 상태 확인" },
    session: { label: "정기 설문 (8회기 당 1번)", sub: "정기 척도 평가" },
  } as const;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted py-8 pb-10">
      <div className="w-full max-w-5xl space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <span className="rounded-sm bg-primary/10 px-2 py-1 text-base font-semibold text-primary">
              {MODE_BADGE[mode].label}
            </span>
            <span className="text-base text-muted-foreground">
              {MODE_BADGE[mode].sub}
            </span>
          </div>
        </div>

        <Card className="w-full max-w-5xl">
          <CardHeader className="space-y-4">
            <Progress value={getProgress()} className="h-2" />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold">
                  {SCALE_LABELS[currentSurvey]} 설문
                </CardTitle>
              </div>

              <span className="text-sm text-muted-foreground">
                {getProgress()}% 완료
              </span>
            </div>

            <CardDescription className="whitespace-pre-line leading-relaxed">
              {SURVEY_GUIDE_TEXT[currentSurvey]}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-8">
              {questions.map((question, index) => (
                <div key={index} className="space-y-3 rounded-sm border p-4">
                  <Label className="text-base font-medium">
                    {index + 1}. {question}
                  </Label>

                  <RadioGroup
                    value={answers[index]?.toString() ?? "0"}
                    onValueChange={(value) =>
                      setCurrentAnswer(index, Number.parseInt(value, 10))
                    }
                    className="flex gap-4"
                  >
                    {SCALE_OPTIONS.map((label, scaleIndex) => (
                      <div
                        key={scaleIndex}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={(scaleIndex + 1).toString()}
                          id={`q${index}-${scaleIndex}`}
                        />
                        <Label
                          htmlFor={`q${index}-${scaleIndex}`}
                          className="cursor-pointer font-normal"
                        >
                          {label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              {currentSurvey !== ScaleType.ANXIETY && (
                <Button variant="outline" size="lg" onClick={handleBack}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  이전
                </Button>
              )}

              <Button
                size="lg"
                onClick={handleNext}
                disabled={!isCurrentSurveyComplete()}
                className={currentSurvey === ScaleType.ANXIETY ? "ml-auto" : ""}
              >
                {currentSurvey === ScaleType.ANGER ? "완료" : "다음"}
                {currentSurvey !== ScaleType.ANGER && (
                  <ChevronRight className="ml-2 h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
