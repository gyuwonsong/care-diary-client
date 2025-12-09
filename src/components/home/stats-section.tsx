import { UI_TEXT } from "@/lib/constants";
import { Emotion, EMOTION_LABELS } from "@/lib/constants";
import { EMOTION_CONFIG } from "@/components/common/emotion-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsSectionProps {
  monthCount: number;
  yearCount: number;
  emotionCounts: Record<Emotion, number>;
}

export function StatsSection({
  monthCount,
  yearCount,
  emotionCounts,
}: StatsSectionProps) {
  return (
    <div className="space-y-4">
      <Card className="border-border bg-card rounded-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            {UI_TEXT.HOME.THIS_MONTH}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-primary">{monthCount}개</p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card rounded-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            {UI_TEXT.HOME.THIS_YEAR}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-primary">{yearCount}개</p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card rounded-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">
            {UI_TEXT.HOME.EMOTION_DISTRIBUTION}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-2">
          {Object.values(Emotion).map((emotion, index, arr) => {
            const config = EMOTION_CONFIG[emotion];
            const Icon = config.icon;
            const count = emotionCounts[emotion] || 0;
            const isLast = index === arr.length - 1;

            return (
              <div
                key={emotion}
                className={`flex items-center justify-between py-2 ${
                  !isLast ? "border-b border-border" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${config.bgColor}`}
                  >
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <span className="text-sm">{EMOTION_LABELS[emotion]}</span>
                </div>

                <span className="text-sm font-medium text-foreground">
                  {count}개
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
