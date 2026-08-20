"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip } from "@/components/progress/chart-tooltip";
import { ClientChart } from "@/components/progress/client-chart";
import {
  CHART_COBALT,
  CHART_LANE,
  CHART_MIST,
  CHART_RAIL,
  CHART_SEAM,
  CHART_SIGNAL,
} from "@/lib/progress/chart-colors";
import { DIFFICULTIES } from "@/lib/problems/types";
import type { DifficultyCounts } from "@/lib/progress/types";

const DIFFICULTY_FILL = {
  Easy: CHART_LANE,
  Medium: CHART_COBALT,
  Hard: CHART_SIGNAL,
} as const;

const tickStyle = {
  fill: CHART_MIST,
  fontSize: 13,
  fontFamily: "Barlow Condensed, ui-sans-serif, sans-serif",
  fontWeight: 700,
};

const labelStyle = {
  fill: CHART_RAIL,
  fontSize: 16,
  fontFamily: "Barlow Condensed, ui-sans-serif, sans-serif",
  fontWeight: 800,
};

export function DifficultyBarChart({
  difficulty,
}: {
  difficulty: DifficultyCounts;
}) {
  const data = DIFFICULTIES.map((name) => ({
    name,
    count: difficulty[name],
    fill: DIFFICULTY_FILL[name],
    tooltip:
      difficulty[name] === 1
        ? `${name}: 1 problem`
        : `${name}: ${difficulty[name]} problems`,
  }));

  return (
    <div className="flex min-h-44 flex-1 flex-col border border-steel-seam bg-lane-board px-4 py-5 sm:px-5">
      <ClientChart className="min-h-44 w-full flex-1">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 12, right: 32, left: 4, bottom: 12 }}
          barCategoryGap="18%"
        >
          <CartesianGrid
            horizontal={false}
            stroke={CHART_SEAM}
            strokeDasharray="0"
          />
          <XAxis type="number" hide allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="name"
            width={80}
            axisLine={false}
            tickLine={false}
            tick={tickStyle}
            tickFormatter={(value) => String(value).toUpperCase()}
          />
          <Tooltip
            content={ChartTooltip}
            cursor={{ fill: "rgba(244, 241, 236, 0.06)" }}
          />
          <Bar
            dataKey="count"
            radius={0}
            minPointSize={2}
            isAnimationActive={false}
          >
            {data.map((item) => (
              <Cell key={item.name} fill={item.fill} />
            ))}
            <LabelList dataKey="count" position="right" style={labelStyle} />
          </Bar>
        </BarChart>
      </ClientChart>
    </div>
  );
}
