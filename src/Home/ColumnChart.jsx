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

export default function ColumnChart({ data }) {
  // Validate and format data
  const formattedData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data.map(item => ({
      name: item.name,
      borrow: item.borrowCount || 0
    }));
  }, [data]);

  if (!formattedData || formattedData.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-gray-500">Không có dữ liệu</div>
      </div>
    );
  }

  return (
    <div className="w-full h-96 flex justify-center">
      <ResponsiveContainer width={600} height={300}>
        <BarChart
          data={formattedData}
          margin={{ top: 20, right: 25, left: 0, bottom: 5 }}
          barGap={10}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: "#A0AEC0" }} 
            tickMargin={10}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            tick={{ fill: "#A0AEC0" }} 
            axisLine={false} 
            tickLine={false}
          />
          <Tooltip 
            formatter={(value) => [`${value} lượt`, 'Số lượt mượn']}
            labelFormatter={(label) => `Tháng: ${label}`}
          />
          <Legend />
          <Bar
            dataKey="borrow"
            fill="#13c2c2"
            barSize={30}
            radius={[5, 5, 0, 0]}
          >
            <LabelList
              dataKey="borrow"
              position="top"
              formatter={(value) => value}
              fontSize={11}
              fill="black"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
