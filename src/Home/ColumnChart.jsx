import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", value: 2.3 },
  { name: "Feb", value: 3.1 },
  { name: "Mar", value: 4.0 },
  { name: "Apr", value: 10.1 },
  { name: "May", value: 4.0 },
  { name: "Jun", value: 3.6 },
  { name: "Jul", value: 3.2 },
  { name: "Aug", value: 2.3 },
  { name: "Sep", value: 1.4 },
  { name: "Oct", value: 0.8 },
  { name: "Nov", value: 0.5 },
  { name: "Dec", value: 0.2 },
];

export default function ColumnChart() {
  return (
    <div className="w-full h-96 flex justify-center">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 25, left: 0, bottom: 5 }}
          barGap={10}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "#A0AEC0" }} tickMargin={10} />
          <YAxis tick={{ fill: "#A0AEC0" }} axisLine={false} tickLine={false} />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="value"
            fill="#8884d8"
            barSize={30}
            radius={[5, 5, 0, 0]}
          >
            <LabelList
              dataKey="value"
              position="top"
              formatter={(value) => `${value}%`}
              fontSize={11}
              fill="black"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
