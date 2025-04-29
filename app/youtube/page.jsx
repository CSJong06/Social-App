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

const chartData = {
  followers: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Followers',
        data: [12000, 15000, 18000, 21000, 24000, 28000],
        borderColor: 'rgb(255, 0, 0)',
        tension: 0.4,
      }
    ],
  },
  interactions: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Interactions',
        data: [45000, 52000, 49000, 60000, 55000, 65000],
        borderColor: 'rgb(255, 0, 0)',
        tension: 0.4,
      }
    ],
  },
  impressions: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Impressions',
        data: [150000, 180000, 210000, 250000, 280000, 320000],
        borderColor: 'rgb(255, 0, 0)',
        tension: 0.4,
      }
    ],
  }
};

const tabs = ['Followers', 'Interactions', 'Impressions'];

export default function YouTube() {
  const [activeTab, setActiveTab] = useState('Followers');

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `YouTube ${activeTab}`
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">YouTube Analytics</h1>
        <button
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Export
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <div className="h-[400px]">
            <Line options={options} data={chartData[activeTab.toLowerCase()]} />
          </div>
        </div>
      </div>
    </div>
  );
} 