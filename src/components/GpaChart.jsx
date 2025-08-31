// src/components/GpaChart.jsx
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

export default function GpaChart({ data }) {
  if (!data || data.length === 0) return <div className="plot chartBox" />;

  // 라벨 줄바꿈(1학년 1학기 → 두 줄) 원하면 사용
  const fmt = (v) => (typeof v === "string" ? v.replace(" ", "\n") : v);

  return (
    <div className="plot chartBox">
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="#e5e7eb" strokeWidth={1} />
          <XAxis
            dataKey="label"
            tickFormatter={fmt}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            tickMargin={12}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[2, 4.5]}
            ticks={[2.0, 3.0, 4.0]}
            tickFormatter={(v) => Number(v).toFixed(1)}  // 2.0, 3.0, 4.0
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Line
            type="monotone"
            dataKey="overall"
            stroke="rgb(249,31,21)"
            strokeWidth={2}
            dot={{ r: 4, stroke: "rgb(249,31,21)", strokeWidth: 2, fill: "#fff" }}
            activeDot={false}
            isAnimationActive={false}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="major"
            stroke="rgb(166,166,166)"
            strokeWidth={2}
            dot={{ r: 4, stroke: "rgb(166,166,166)", strokeWidth: 2, fill: "#fff" }}
            activeDot={false}
            isAnimationActive={false}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


