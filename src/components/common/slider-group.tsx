"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { UI_TEXT } from "@/lib/constants";

interface SliderItem {
  question: string;
  value: number;
  onChange: (value: number) => void;
}

interface SliderGroupProps {
  sliders: SliderItem[];
  className?: string;
}

export function SliderGroup({ sliders, className = "" }: SliderGroupProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {sliders.map((slider, index) => (
        <div key={index} className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <Label className="text-base leading-relaxed">
              {slider.question}
            </Label>
            <span className="text-xl font-semibold text-primary">
              {slider.value}
            </span>
          </div>
          <div className="space-y-2">
            <Slider
              value={[slider.value]}
              onValueChange={([val]) => slider.onChange(val)}
              min={0}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{UI_TEXT.DIARY.REFLECTION_MIN}</span>
              <span>{UI_TEXT.DIARY.REFLECTION_MAX}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
