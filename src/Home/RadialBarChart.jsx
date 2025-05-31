import React from "react";
import { RadialBarChart, RadialBar, Legend } from "recharts";

const data = [
  {
    name: "Progress",
    value: 65,
    fill: "#FF6B6B",
  },
];

const RadialChart = () => {
  return (
    <div className="flex justify-center">
      <RadialBarChart
        width={80}
        height={80}
        cx="50%"
        cy="50%"
        innerRadius="120%"
        outerRadius="100%"
        barSize={12}
        data={data}
        startAngle={90}
        endAngle={-120}
      >
        <RadialBar minAngle={15} clockWise dataKey="value" />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="16px"
          fontWeight="semi-bold"
          fill="#333"
        >
          65k
        </text>
      </RadialBarChart>
    </div>
  );
};

export default RadialChart;