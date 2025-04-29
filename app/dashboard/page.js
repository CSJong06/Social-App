'use client';

import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState('30d');

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Instagram',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Twitter',
        data: [8, 15, 7, 9, 12, 15],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Social Media Growth',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Track your social media growth and engagement
        </p>
      </div>

      {/* Timeframe selector */}
      <div className="mb-8">
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="input-field w-48"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Chart */}
      <div className="card mb-8">
        <Line options={options} data={chartData} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Total Followers</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">12,345</p>
          <p className="mt-2 text-sm text-green-600">+2.5% from last month</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Engagement Rate</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">4.2%</p>
          <p className="mt-2 text-sm text-red-600">-0.3% from last month</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Total Posts</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">256</p>
          <p className="mt-2 text-sm text-green-600">+12 new posts</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Average Reach</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">1.2K</p>
          <p className="mt-2 text-sm text-green-600">+5.1% from last month</p>
        </div>
      </div>
    </div>
  );
} 