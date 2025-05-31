import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const data = [
  { name: "Apple", value: 400 },
  { name: "Samsung", value: 300 },
  { name: "Xiaomi", value: 200 },
  { name: "Oppo", value: 100 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function MyPieChart() {
  return (
    <div className="flex justify-center">
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
