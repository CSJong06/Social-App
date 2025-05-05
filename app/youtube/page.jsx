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
import { dispatchPlatformUpdate } from '../lib/events';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'YouTube Analytics'
    },
  },
  scales: {
    y: {
      beginAtZero: true
    },
    x: {
      ticks: {
        maxTicksLimit: 7,
        callback: function(value, index, values) {
          // Only show every 4th date
          if (index % 4 === 0) {
            const date = new Date(this.getLabelForValue(value));
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }
          return '';
        }
      }
    }
  }
};

export default function YouTube() {
  const { user, loading } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeTab, setActiveTab] = useState('followers');
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const connectPlatform = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      const response = await fetch('/api/analytics/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ platform: 'youtube' }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect YouTube');
      }

      setIsConnected(true);
      fetchAnalyticsData();
      dispatchPlatformUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch('/api/analytics/youtube');
      if (!response.ok) {
        if (response.status === 404) {
          setIsConnected(false);
          setChartData(null);
          return;
        }
        throw new Error('Failed to fetch analytics data');
      }
      const data = await response.json();
      
      if (!data.analytics || data.analytics.length === 0) {
        setIsConnected(false);
        setChartData(null);
        return;
      }
      
      // Transform the data for chart.js
      const transformedData = {
        followers: {
          labels: data.analytics.map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }),
          datasets: [
            {
              label: 'Subscribers',
              data: data.analytics.map(item => item.subscribers),
              borderColor: 'rgb(252, 165, 165)',
              backgroundColor: 'rgba(252, 165, 165, 0.1)',
              tension: 0.4,
            }
          ],
        },
        interactions: {
          labels: data.analytics.map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }),
          datasets: [
            {
              label: 'Likes',
              data: data.analytics.map(item => item.likes),
              borderColor: 'rgb(147, 197, 253)',
              backgroundColor: 'rgba(147, 197, 253, 0.1)',
              tension: 0.4,
            }
          ],
        },
        impressions: {
          labels: data.analytics.map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }),
          datasets: [
            {
              label: 'Views',
              data: data.analytics.map(item => item.views),
              borderColor: 'rgb(251, 191, 36)',
              backgroundColor: 'rgba(251, 191, 36, 0.1)',
              tension: 0.4,
            }
          ],
        }
      };

      setChartData(transformedData);
      setIsConnected(true);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to fetch analytics data');
      setIsConnected(false);
      setChartData(null);
    } finally {
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    if (user?.isAuthenticated) {
      fetchAnalyticsData();
    }
  }, [user]);

  if (loading || (isInitialLoad && user?.isAuthenticated)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">YouTube Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your YouTube channel's performance metrics and growth over time.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-4">YouTube Not Connected</h2>
          <p className="text-gray-600 mb-6">
            Connect your YouTube account to view analytics.
          </p>
          {error && (
            <p className="text-red-500 mb-4">{error}</p>
          )}
          <button
            onClick={connectPlatform}
            disabled={isConnecting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            {isConnecting ? 'Connecting...' : 'Connect YouTube'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">YouTube Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your YouTube channel's performance metrics and growth over time.
        </p>
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
            {chartData && (
              <Line 
                options={{
                  ...options,
                  maintainAspectRatio: false,
                  responsive: true,
                }} 
                data={chartData[activeTab]} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 