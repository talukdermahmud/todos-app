"use client";

import React from "react";
import { useGetTodosQuery } from "../../lib/api";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = {
  extreme: "#00008B",
  moderate: "#4169E1",
  low: "#87CEEB",
};

export default function Dashboard() {
  const { data: todosData } = useGetTodosQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  // Count todos by priority
  const { priorityCounts, counts, totalTasks } = React.useMemo(() => {
    if (!todosData?.results)
      return {
        priorityCounts: [],
        counts: { extreme: 0, moderate: 0, low: 0 },
        totalTasks: 0,
      };

    const counts = { extreme: 0, moderate: 0, low: 0 };
    todosData.results.forEach((todo) => {
      if (counts[todo.priority] !== undefined) {
        counts[todo.priority]++;
      }
    });

    const priorityCounts = Object.entries(counts)
      .map(([priority, count]) => ({
        priority: priority.charAt(0).toUpperCase() + priority.slice(1),
        count,
        fill: COLORS[priority as keyof typeof COLORS],
      }))
      .filter((item) => item.count > 0);

    const totalTasks = todosData.results.length;

    return { priorityCounts, counts, totalTasks };
  }, [todosData]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Dashboard
          <div className="h-1 w-25 bg-[#5272FF] mt-2"></div>
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-700">Total Tasks</h3>
          <p className="text-3xl font-bold text-[#5272FF]">{totalTasks}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow cursor-pointer">
          <h3
            className="text-lg font-semibold text-gray-700"
            style={{ color: COLORS.extreme }}
          >
            Extreme
          </h3>
          <p className="text-3xl font-bold" style={{ color: COLORS.extreme }}>
            {counts.extreme}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow cursor-pointer">
          <h3
            className="text-lg font-semibold text-gray-700"
            style={{ color: COLORS.moderate }}
          >
            Moderate
          </h3>
          <p className="text-3xl font-bold" style={{ color: COLORS.moderate }}>
            {counts.moderate}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow cursor-pointer">
          <h3
            className="text-lg font-semibold text-gray-700"
            style={{ color: COLORS.low }}
          >
            Low
          </h3>
          <p className="text-3xl font-bold" style={{ color: COLORS.low }}>
            {counts.low}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Tasks by Priority</h2>

        {priorityCounts.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityCounts}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ payload }) => `${payload.priority}: ${payload.count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {priorityCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No tasks available.</p>
        )}
      </div>
    </div>
  );
}
