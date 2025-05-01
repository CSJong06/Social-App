'use client';

import { useState, useEffect } from 'react';
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
import { useAuth } from '../lib/auth';
import Link from 'next/link';

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
        data: [100, 200, 300, 400, 500, 600],
        borderColor: 'rgb(147, 197, 253)',
        backgroundColor: 'rgba(147, 197, 253, 0.1)',
        tension: 0.4,
      }
    ],
  },
  interactions: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Likes',
        data: [1000, 2000, 3000, 4000, 5000, 6000],
        borderColor: 'rgb(252, 165, 165)',
        backgroundColor: 'rgba(252, 165, 165, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Comments',
        data: [100, 200, 300, 400, 500, 600],
        borderColor: 'rgb(167, 243, 208)',
        backgroundColor: 'rgba(167, 243, 208, 0.1)',
        tension: 0.4,
      }
    ],
  },
  impressions: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Views',
        data: [5000, 10000, 15000, 20000, 25000, 30000],
        borderColor: 'rgb(216, 180, 254)',
        backgroundColor: 'rgba(216, 180, 254, 0.1)',
        tension: 0.4,
      }
    ],
  }
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'TikTok Analytics'
    },
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
};

export default function TikTok() {
  const { user, loading } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('followers');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedConnections = localStorage.getItem('socialConnections');
      if (savedConnections) {
        const connections = JSON.parse(savedConnections);
        setIsConnected(connections.tiktok);
      }
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">TikTok Analytics</h1>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-4">TikTok Not Connected</h2>
          <p className="text-gray-600 mb-6">
            Please connect your TikTok account in the Profile section to view analytics.
          </p>
          <Link
            href="/profile"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Go to Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">TikTok Analytics</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('followers')}
              className={`${
                activeTab === 'followers'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Followers
            </button>
            <button
              onClick={() => setActiveTab('interactions')}
              className={`${
                activeTab === 'interactions'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Interactions
            </button>
            <button
              onClick={() => setActiveTab('impressions')}
              className={`${
                activeTab === 'impressions'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Impressions
            </button>
          </nav>
        </div>

        <div className="p-6">
          <div className="w-full h-[400px] max-h-[400px] overflow-hidden">
            <Line 
              options={{
                ...options,
                maintainAspectRatio: false,
                responsive: true,
              }} 
              data={chartData[activeTab]} 
            />
          </div>
        </div>
      </div>
    </div>
  );
} 