import { Frown, Heart, Smile } from "lucide-react";

export type Emotion = "HAPPY" | "LOVE" | "SAD";
export type Gender = "MALE" | "FEMALE";
export type ScaleType = "ANXIETY" | "DEPRESSION" | "ANGER";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export const Emotion = {
  HAPPY: "HAPPY" as const,
  LOVE: "LOVE" as const,
  SAD: "SAD" as const,
};

export const Gender = {
  MALE: "MALE" as const,
  FEMALE: "FEMALE" as const,
};

export const ScaleType = {
  ANXIETY: "ANXIETY" as const,
  DEPRESSION: "DEPRESSION" as const,
  ANGER: "ANGER" as const,
};

export const EMOTION_LABELS: Record<Emotion, string> = {
  [Emotion.HAPPY]: "행복",
  [Emotion.LOVE]: "사랑",
  [Emotion.SAD]: "슬픔",
};

export const EMOTION_CONFIG = {
  [Emotion.HAPPY]: {
    icon: Smile,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    selectedBg: "bg-green-500/20",
    border: "border-green-500",
  },
  [Emotion.LOVE]: {
    icon: Heart,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    selectedBg: "bg-pink-500/20",
    border: "border-pink-500",
  },
  [Emotion.SAD]: {
    icon: Frown,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    selectedBg: "bg-purple-500/20",
    border: "border-purple-500",
  },
};

export const GENDER_LABELS: Record<Gender, string> = {
  [Gender.MALE]: "남성",
  [Gender.FEMALE]: "여성",
};

export const SCALE_LABELS: Record<ScaleType, string> = {
  [ScaleType.ANXIETY]: "불안",
  [ScaleType.DEPRESSION]: "우울",
  [ScaleType.ANGER]: "분노",
};

export const REFLECTION_QUESTIONS = [
  "당신의 가장 깊은 내면의 생각과 감정들을 어느 정도 표현했나요?",
  "당신의 현재 느끼는 슬픔은 어느 정도인가요?",
  "당신의 현재 느끼는 분노는 어느 정도인가요?",
  "당신이 현재 느끼는 행복감은 어느 정도인가요?",
  "오늘의 글쓰기가 어느 정도 당신에게 가치있고 의미있는 일이었나요?",
  "이후에 참고할 수 있도록 오늘의 글쓰기에 점수를 매긴다면 어느 정도인가요?",
] as const;

export const UI_TEXT = {
  HOME: {
    TODAY_QUESTION: "오늘의 질문",
    RECOMMENDED: "당신을 위한 추천 서비스",
    THIS_MONTH: "이달의 일기",
    THIS_YEAR: "올해의 일기",
    EMOTION_DISTRIBUTION: "감정 분포",
  },
  DIARY: {
    SELECT_EMOTION: "오늘의 감정을 선택해주세요",
    WRITE_CONTENT: "오늘 하루는 어땠나요?",
    REFLECTION_MIN: "전혀",
    REFLECTION_MAX: "매우",
  },
  GRAPHS: {
    TITLE: "척도 분석",
    SESSION: "차수",
    SCORE: "점수",
    EMPTY_STATE: "아직 데이터가 없습니다",
  },
} as const;

export const anxietyQuestions = [
  "신경이 곤두서거나 긴장감이 든다.",
  "늘 즐기던 일들이 여전히 즐겁다.",
  "뭔가 끔찍한 일이 일어날 것처럼 공포감이 든다.",
  "웃을 수도 있고 어떤 일의 재미있는 면을 볼 수 있다.",
  "걱정스러운 마음이 가득하다.",
  "명랑한 기분이 든다.",
  "편히 앉아 긴장을 풀 수 있다.",
  "활기가 없는 것처럼 느껴진다.",
  "떨리고 두려운 느낌이 든다.",
  "나의 외모에 대한 관심이 없어졌다.",
  "무언가 꼭 하고 있어야 할 정도로 불안해서 가만히 있을 수가 없다.",
  "어떤 일의 즐거움에 고대하다.",
  "갑작스럽게 극심한 당혹감을 느낀다.",
  "좋은 책이나 라디오, TV 프로그램을 즐길 수 있다.",
];

export const depressionQuestions = [
  "평소에는 성가시지 않았던 일이 성가시게 느껴졌다.",
  "별로 먹고 싶지 않았다거나 입맛이 없었다.",
  "가족이나 친구가 도와주더라도 울적한 기분을 떨칠 수 없었다.",
  "나도 다른 사람들만큼 기분이 좋았다.",
  "하고 있는 일에 마음을 집중하기가 어려웠다.",
  "우울했다.",
  "하는 일마다 힘들게 느껴졌다.",
  "미래에 대해 희망적으로 느꼈다.",
  "내 인생은 실패작이라고 생각했다.",
  "무서움을 느꼈다.",
  "잠을 설쳤다.",
  "행복했다.",
  "평소보다 말을 적게 했다.",
  "외로움을 느꼈다.",
  "사람들이 불친절했다.",
  "인생이 즐거웠다.",
  "울음을 터뜨린 적이 있었다.",
  "슬픔을 느꼈다.",
  "사람들이 나를 싫어한다고 느꼈다.",
  "일을 제대로 진척시킬 수 없었다.",
];

export const angerQuestions = [
  "나는 화를 참는다.",
  "나는 화난 감정을 표현한다.",
  "나는 말을 하지 않는다.",
  "나는 사람들에게 인내심을 갖고 대한다.",
  "나는 뚱해지거나 토라진다.",
  "나는 사람들을 피한다.",
  "나는 소리를 지른다.",
  "나는 냉정을 유지한다.",
  "나는 문을 꽝 닫아버리는 식의 행동을 한다.",
  "나는 상대의 시선을 피한다.",
  "나는 나의 행동을 자제한다.",
  "나는 사람들과 말다툼을 한다.",
  "나는 아무에게도 말하지 않으나, 안으로 앙심을 품는 경향이 있다.",
  "나는 목소리를 높인다.",
  "나는 화가 나더라도 침착하게 자제할 수 있다.",
  "나는 속으로 다른 사람을 비판한다.",
  "나는 나 자신이 인정하고 싶은 것보다 화가 더 나 있다.",
  "나는 대부분의 사람들보다 진정을 빨리한다.",
  "나는 욕을 한다.",
  "나는 참고 이해하려고 노력한다.",
  "나는 다른 사람들이 알고 있는 것보다 분통이 더 나 있다.",
  "나는 자제심을 잃고 화를 낸다.",
  "나는 화난 표정을 짓는다.",
  "나는 화난 감정을 자제한다.",
];

export type MedicalCoverage =
  | "HEALTH_INSURANCE"
  | "MEDICAL_AID_1"
  | "MEDICAL_AID_2"
  | "NEAR_POOR_1"
  | "NEAR_POOR_2"
  | "";

export const MEDICAL_COVERAGE_LABELS: Record<
  Exclude<MedicalCoverage, "">,
  string
> = {
  HEALTH_INSURANCE: "건강보험",
  MEDICAL_AID_1: "의료급여 1종",
  MEDICAL_AID_2: "의료급여 2종",
  NEAR_POOR_1: "차상위 1종",
  NEAR_POOR_2: "차상위 2종",
};

export type DisabilityStatus = "REGISTERED" | "IN_PROGRESS" | "NOT_REGISTERED";
export type DisabilitySeverity = "SEVERE" | "NOT_SEVERE" | "";

export type SocialWelfareService =
  | "CAREGIVER_COST"
  | "SPECIAL_DIET_PURCHASE"
  | "DISABILITY_ALLOWANCE"
  | "DISABLED_CHILD_ALLOWANCE"
  | "DISABILITY_PENSION"
  | "NATIONAL_PENSION_DISABILITY_PENSION"
  | "BASIC_PENSION";

export const SOCIAL_WELFARE_LABELS: Record<SocialWelfareService, string> = {
  CAREGIVER_COST: "간병비",
  SPECIAL_DIET_PURCHASE: "특수 식이 구입비",
  DISABILITY_ALLOWANCE: "장애수당",
  DISABLED_CHILD_ALLOWANCE: "장애아동수당",
  DISABILITY_PENSION: "장애인 연금",
  NATIONAL_PENSION_DISABILITY_PENSION: "국민연금 내 장애 연금",
  BASIC_PENSION: "기초연금",
};
