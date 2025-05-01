'use client';

import { useState, useEffect } from 'react';
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
        label: 'YouTube',
        data: [12, 19, 15, 25, 22, 30],
        borderColor: 'rgb(252, 165, 165)',
        backgroundColor: 'rgba(252, 165, 165, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Instagram',
        data: [8, 15, 20, 18, 25, 28],
        borderColor: 'rgb(244, 114, 182)',
        backgroundColor: 'rgba(244, 114, 182, 0.1)',
        tension: 0.4,
      },
      {
        label: 'TikTok',
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
        label: 'YouTube Likes',
        data: [120, 150, 180, 190, 210, 250],
        borderColor: 'rgb(252, 165, 165)',
        backgroundColor: 'rgba(252, 165, 165, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Instagram Likes',
        data: [80, 100, 130, 150, 180, 200],
        borderColor: 'rgb(244, 114, 182)',
        backgroundColor: 'rgba(244, 114, 182, 0.1)',
        tension: 0.4,
      },
      {
        label: 'TikTok Likes',
        data: [1000, 2000, 3000, 4000, 5000, 6000],
        borderColor: 'rgb(147, 197, 253)',
        backgroundColor: 'rgba(147, 197, 253, 0.1)',
        tension: 0.4,
      }
    ],
  },
  impressions: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'YouTube Views',
        data: [1000, 1500, 2000, 2500, 3000, 3500],
        borderColor: 'rgb(252, 165, 165)',
        backgroundColor: 'rgba(252, 165, 165, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Instagram Reach',
        data: [500, 800, 1000, 1200, 1500, 1800],
        borderColor: 'rgb(244, 114, 182)',
        backgroundColor: 'rgba(244, 114, 182, 0.1)',
        tension: 0.4,
      },
      {
        label: 'TikTok Views',
        data: [5000, 10000, 15000, 20000, 25000, 30000],
        borderColor: 'rgb(147, 197, 253)',
        backgroundColor: 'rgba(147, 197, 253, 0.1)',
        tension: 0.4,
      }
    ],
  }
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
    },
    title: {
      display: true,
      text: 'Social Media Analytics'
    },
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
};

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('followers');
  const [isClient, setIsClient] = useState(false);
  const [connections, setConnections] = useState({
    youtube: false,
    instagram: false,
    tiktok: false
  });

  useEffect(() => {
    setIsClient(true);
    const savedConnections = localStorage.getItem('socialConnections');
    if (savedConnections) {
      setConnections(JSON.parse(savedConnections));
    }
  }, []);

  if (loading || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const hasAnyConnection = Object.values(connections).some(value => value);

  if (!hasAnyConnection) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-4">No Social Media Accounts Connected</h2>
          <p className="text-gray-600 mb-6">
            Please connect at least one social media account in the Profile section to view analytics.
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
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button
          onClick={() => {/* Add export functionality */}}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Export
        </button>
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
            {isClient && (
              <Line 
                options={options} 
                data={{
                  ...chartData[activeTab],
                  datasets: chartData[activeTab].datasets.filter((dataset) => {
                    if (dataset.label.toLowerCase().includes('youtube')) return connections.youtube;
                    if (dataset.label.toLowerCase().includes('instagram')) return connections.instagram;
                    if (dataset.label.toLowerCase().includes('tiktok')) return connections.tiktok;
                    return false;
                  })
                }} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 