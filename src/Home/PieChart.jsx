import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const BASE_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6B6B"];
const OTHER_COLOR = "#A9A9A9";

export default function MyPieChart({ data }) {
  const MAX_ITEMS = 5;

  // Filter out items with 0 borrow count and sort by borrow count
  const sorted = [...data]
    .filter(item => (item.borrowCount || 0) > 0)
    .sort((a, b) => (b.borrowCount || 0) - (a.borrowCount || 0));

  const topItems = sorted.slice(0, MAX_ITEMS);
  const otherItems = sorted.slice(MAX_ITEMS);

  const otherValue = otherItems.reduce((sum, item) => sum + (item.borrowCount || 0), 0);
  
  // Calculate total for percentage
  const total = [...topItems, ...otherItems].reduce((sum, item) => sum + (item.borrowCount || 0), 0);
  
  // Transform data to include name, value, and percentage
  const chartData = [
    ...topItems.map(item => ({
      name: item.name,
      value: item.borrowCount || 0,
      percentage: ((item.borrowCount || 0) / total * 100).toFixed(1)
    })),
    ...(otherValue >= 0 ? [{ 
      name: "Other", 
      value: otherValue,
      percentage: (otherValue / total * 100).toFixed(1)
    }] : [])
  ];

  return (
    <div className="flex justify-center">
      <PieChart width={500} height={400}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percentage }) => `${name}: ${percentage}%`}
        >
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={index < BASE_COLORS.length ? BASE_COLORS[index] : OTHER_COLOR}
              outerRadius={entry.name === "Other" ? 100 : 120}
            />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value, name, props) => [
            `${props.payload.percentage}% (${value} borrows)`,
            name
          ]} 
        />
        <Legend />
      </PieChart>
    </div>
  );
}
