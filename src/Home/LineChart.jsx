import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", value: 2.3 },
  { month: "Feb", value: 3.1 },
  { month: "Mar", value: 4.0 },
  { month: "Apr", value: 10.1 },
  { month: "May", value: 4.0 },
  { month: "Jun", value: 3.6 },
  { month: "Jul", value: 3.2 },
  { month: "Aug", value: 2.3 },
  { month: "Sep", value: 1.4 },
  { month: "Oct", value: 0.8 },
  { month: "Nov", value: 0.5 },
  { month: "Dec", value: 0.2 },
];


export default function MyLineChart() {
  return (
    <div className="w-full h-96 flex justify-center">
      <ResponsiveContainer width="80%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fill: "#A0AEC0" }} />
          <YAxis tick={{ fill: "#A0AEC0" }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={3} dot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};