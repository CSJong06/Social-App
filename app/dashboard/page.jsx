'use client';

import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useAuth } from '../lib/auth';
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

const tabs = ['Followers', 'Interactions', 'Impressions'];

const chartData = {
  followers: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'YouTube',
        data: [12, 19, 15, 25, 22, 30],
        borderColor: 'rgb(255, 0, 0)',
        tension: 0.4,
      },
      {
        label: 'Instagram',
        data: [8, 15, 20, 18, 25, 28],
        borderColor: 'rgb(188, 42, 141)',
        tension: 0.4,
      },
      {
        label: 'TikTok',
        data: [5, 10, 15, 20, 23, 25],
        borderColor: 'rgb(0, 0, 0)',
        tension: 0.4,
      }
    ],
  },
  interactions: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'YouTube',
        data: [120, 150, 180, 190, 210, 250],
        borderColor: 'rgb(255, 0, 0)',
        tension: 0.4,
      },
      {
        label: 'Instagram',
        data: [80, 100, 130, 150, 180, 200],
        borderColor: 'rgb(188, 42, 141)',
        tension: 0.4,
      },
      {
        label: 'TikTok',
        data: [50, 80, 120, 140, 160, 190],
        borderColor: 'rgb(0, 0, 0)',
        tension: 0.4,
      }
    ],
  },
  impressions: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'YouTube',
        data: [1200, 1500, 1800, 2100, 2400, 2800],
        borderColor: 'rgb(255, 0, 0)',
        tension: 0.4,
      },
      {
        label: 'Instagram',
        data: [800, 1100, 1400, 1700, 2000, 2300],
        borderColor: 'rgb(188, 42, 141)',
        tension: 0.4,
      },
      {
        label: 'TikTok',
        data: [500, 800, 1200, 1500, 1800, 2100],
        borderColor: 'rgb(0, 0, 0)',
        tension: 0.4,
      }
    ],
  }
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Followers');
  const { logout } = useAuth();

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${activeTab} Overview`
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting data...');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button
          onClick={handleExport}
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
                    ? 'border-indigo-500 text-indigo-600'
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