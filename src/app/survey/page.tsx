"use client";

import { useRouter } from "next/navigation";
import { SurveyForm } from "@/components/survey/survey-form";

export default function SurveyPage() {
  const router = useRouter();

  return (
    <SurveyForm
      mode="session"
      onComplete={(payload) => {
        // TODO: 회기별 설문 저장 API 호출
        console.log("SESSION survey payload:", payload);

        router.push("/home");
      }}
    />
  );
}
