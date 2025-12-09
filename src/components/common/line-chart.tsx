"use client";

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { UI_TEXT } from "@/lib/constants";

interface DataPoint {
  session: number;
  score: number;
}

interface LineChartProps {
  data: DataPoint[];
  color?: string;
  title?: string;
}

export function LineChart({
  data,
  color = "hsl(var(--primary))",
  title,
}: LineChartProps) {
  const isEmpty = !data || data.length === 0;

  return (
    <div className="rounded-sm border bg-card p-6">
      {title && <h3 className="mb-4 text-lg font-semibold">{title}</h3>}

      {isEmpty ? (
        <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
          {UI_TEXT.GRAPHS.EMPTY_STATE}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <RechartsLineChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="session"
              label={{
                value: UI_TEXT.GRAPHS.SESSION,
                position: "insideBottom",
                offset: -5,
              }}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              stroke="hsl(var(--border))"
            />
            <YAxis
              label={{
                value: UI_TEXT.GRAPHS.SCORE,
                angle: -90,
                position: "insideLeft",
              }}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              stroke="hsl(var(--border))"
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "4px",
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke={color}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
