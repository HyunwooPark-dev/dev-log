"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

// Placeholder data - will be replaced with React Query hook
const tagStats = [
  { tag: "react", count: 24, percentage: 30 },
  { tag: "typescript", count: 18, percentage: 22.5 },
  { tag: "nextjs", count: 15, percentage: 18.75 },
  { tag: "prisma", count: 12, percentage: 15 },
  { tag: "tailwind", count: 11, percentage: 13.75 },
]

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export function TagStatsChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={tagStats}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" />
          <YAxis
            dataKey="tag"
            type="category"
            tickFormatter={(value) => `#${value}`}
          />
          <Tooltip
            formatter={(value: number) => [`${value}개`, "로그 수"]}
            labelFormatter={(label) => `#${label}`}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {tagStats.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
