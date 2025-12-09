"use client";

import { Emotion, EMOTION_LABELS, EMOTION_CONFIG } from "@/lib/constants";

interface EmotionSelectorProps {
  selected: Emotion | null;
  onSelect: (emotion: Emotion) => void;
  className?: string;
}

export function EmotionSelector({
  selected,
  onSelect,
  className = "",
}: EmotionSelectorProps) {
  return (
    <div className={`grid grid-cols-3 gap-3 ${className}`}>
      {Object.values(Emotion).map((emotion) => {
        const config = EMOTION_CONFIG[emotion];
        const Icon = config.icon;
        const isSelected = selected === emotion;

        return (
          <button
            key={emotion}
            type="button"
            onClick={() => onSelect(emotion)}
            className={`flex flex-col items-center gap-2 rounded-sm border-2 p-4 transition-all ${
              isSelected
                ? `${config.border} ${config.selectedBg} scale-105`
                : `border-transparent ${config.bgColor} hover:scale-105`
            }`}
          >
            <Icon className={`h-7 w-7 ${config.color}`} />
            <span
              className={`text-sm font-medium ${isSelected ? config.color : "text-foreground"}`}
            >
              {EMOTION_LABELS[emotion]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export { EMOTION_CONFIG };
