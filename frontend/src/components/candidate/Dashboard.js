import React, { useContext, useEffect } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ResultContext from "../../Context/Resultcontext/ResultContext";

const Dashboard = () => {
  const { myStats, getStats } = useContext(ResultContext);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if(token){
      getStats();
    }
    // eslint-disable-next-line
  }, [getStats]);

  if (!token) {
    return (
      <div className="w-full flex items-center justify-center from-purple-100 via-purple-200 to-purple-300  p-6">
      </div>
    );
  }

  return (
    <div className=" from-purple-100 via-purple-200 to-purple-300  p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        📊 Quiz Dashboard
      </h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Stat Cards */}
        <div className="grid  grid-cols-2 md:grid-cols-2 gap-4 w-full lg:w-1/2">
          <StatCard title="Total Tests" value={myStats.totalTests} icon="📝" />
          <StatCard title="Total Stars" value={myStats.totalStars} icon="⭐" />
          <StatCard
            title="Average Score"
            value={`${myStats.averageScore}%`}
            icon="📈"
          />
          <StatCard
            title="Highest Score"
            value={`${myStats.highestScore}%`}
            icon="🏆"
          />
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md w-full lg:w-1/2">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Score Progress
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={myStats.scoreProgress}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#4f46e5" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-5 rounded-xl shadow-md flex flex-col items-center text-center hover:shadow-lg transition">
    <div className="text-3xl mb-2">{icon}</div>
    <h4 className="text-md font-medium text-gray-600">{title}</h4>
    <p className="text-xl font-bold text-indigo-600">{value}</p>
  </div>
);

export default Dashboard;
