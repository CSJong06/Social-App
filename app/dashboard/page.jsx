'use client';

import { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { useAuth } from '../lib/auth';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
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
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

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
  const [chartData, setChartData] = useState({
    followers: { labels: [], datasets: [] },
    interactions: { labels: [], datasets: [] },
    impressions: { labels: [], datasets: [] }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    const fetchConnections = async () => {
      try {
        const response = await fetch('/api/users/me');
        if (response.ok) {
          const data = await response.json();
          const connectedPlatforms = data.connectedPlatforms || [];
          setConnections({
            youtube: connectedPlatforms.includes('youtube'),
            instagram: connectedPlatforms.includes('instagram'),
            tiktok: connectedPlatforms.includes('tiktok')
          });
        }
      } catch (error) {
        console.error('Error fetching connections:', error);
      }
    };
    fetchConnections();
  }, []);

  // Fetch analytics data when connections change
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!isClient) return;
      
      setIsLoading(true);
      try {
        const platforms = ['youtube', 'instagram', 'tiktok'];
        const analyticsData = {};

        // Fetch data for each connected platform
        for (const platform of platforms) {
          if (connections[platform]) {
            console.log(`Fetching data for ${platform}...`);
            const response = await fetch(`/api/analytics/${platform}`);
            if (response.ok) {
              const data = await response.json();
              console.log(`${platform} data:`, data);
              analyticsData[platform] = data.analytics || [];
            }
          }
        }

        // Transform data for charts
        const transformedData = {
          followers: {
            labels: [],
            datasets: []
          },
          interactions: {
            labels: [],
            datasets: []
          },
          impressions: {
            labels: [],
            datasets: [{
              data: [],
              backgroundColor: [],
              borderColor: [],
              borderWidth: 1
            }]
          }
        };

        // Process data for each platform
        Object.entries(analyticsData).forEach(([platform, data]) => {
          if (data.length === 0) return;

          console.log(`Processing ${platform} data:`, data);

          // Get unique dates across all platforms
          const dates = [...new Set(data.map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }))].sort();

          // Add labels if not already present
          if (transformedData.followers.labels.length === 0) {
            transformedData.followers.labels = dates;
            transformedData.interactions.labels = dates;
          }

          // Add datasets for each metric
          if (platform === 'youtube' && connections.youtube) {
            console.log('Adding YouTube datasets...');
            transformedData.followers.datasets.push({
              label: 'YouTube Subscribers',
              data: data.map(item => item.subscribers),
              borderColor: 'rgb(220, 38, 38)',
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              tension: 0.4
            });
            transformedData.interactions.datasets.push({
              label: 'YouTube Likes',
              data: data.map(item => item.likes),
              borderColor: 'rgb(185, 28, 28)',
              backgroundColor: 'rgba(185, 28, 28, 0.8)',
              tension: 0.4
            });
            // Add to pie chart data
            const totalViews = data.reduce((sum, item) => sum + item.views, 0);
            transformedData.impressions.labels.push('YouTube Views');
            transformedData.impressions.datasets[0].data.push(totalViews);
            transformedData.impressions.datasets[0].backgroundColor.push('rgba(220, 38, 38, 0.8)');
            transformedData.impressions.datasets[0].borderColor.push('rgb(220, 38, 38)');
          } else if (platform === 'instagram' && connections.instagram) {
            transformedData.followers.datasets.push({
              label: 'Instagram Followers',
              data: data.map(item => item.followers),
              borderColor: 'rgb(244, 114, 182)',
              backgroundColor: 'rgba(244, 114, 182, 0.1)',
              tension: 0.4
            });
            transformedData.interactions.datasets.push({
              label: 'Instagram Likes',
              data: data.map(item => item.likes),
              borderColor: 'rgb(219, 39, 119)',
              backgroundColor: 'rgba(219, 39, 119, 0.8)',
              tension: 0.4
            });
            // Add to pie chart data
            const totalReach = data.reduce((sum, item) => sum + item.reach, 0);
            transformedData.impressions.labels.push('Instagram Reach');
            transformedData.impressions.datasets[0].data.push(totalReach);
            transformedData.impressions.datasets[0].backgroundColor.push('rgba(244, 114, 182, 0.8)');
            transformedData.impressions.datasets[0].borderColor.push('rgb(244, 114, 182)');
          } else if (platform === 'tiktok' && connections.tiktok) {
            transformedData.followers.datasets.push({
              label: 'TikTok Followers',
              data: data.map(item => item.followers),
              borderColor: 'rgb(75, 85, 99)',
              backgroundColor: 'rgba(75, 85, 99, 0.1)',
              tension: 0.4
            });
            transformedData.interactions.datasets.push({
              label: 'TikTok Likes',
              data: data.map(item => item.likes),
              borderColor: 'rgb(55, 65, 81)',
              backgroundColor: 'rgba(55, 65, 81, 0.8)',
              tension: 0.4
            });
            // Add to pie chart data
            const totalViews = data.reduce((sum, item) => sum + item.views, 0);
            transformedData.impressions.labels.push('TikTok Views');
            transformedData.impressions.datasets[0].data.push(totalViews);
            transformedData.impressions.datasets[0].backgroundColor.push('rgba(75, 85, 99, 0.8)');
            transformedData.impressions.datasets[0].borderColor.push('rgb(75, 85, 99)');
          }
        });

        console.log('Final transformed data:', transformedData);
        setChartData(transformedData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [connections, isClient]);

  // Listen for platform updates
  useEffect(() => {
    const handlePlatformUpdate = async () => {
      const response = await fetch('/api/users/me');
      if (response.ok) {
        const data = await response.json();
        const connectedPlatforms = data.connectedPlatforms || [];
        setConnections({
          youtube: connectedPlatforms.includes('youtube'),
          instagram: connectedPlatforms.includes('instagram'),
          tiktok: connectedPlatforms.includes('tiktok')
        });
      }
    };

    window.addEventListener('platformUpdate', handlePlatformUpdate);
    return () => window.removeEventListener('platformUpdate', handlePlatformUpdate);
  }, []);

  if (loading || !isClient || isLoading) {
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
              activeTab === 'interactions' ? (
                <Bar 
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
              ) : activeTab === 'impressions' ? (
                <Pie 
                  options={{
                    ...options,
                    plugins: {
                      ...options.plugins,
                      legend: {
                        position: 'right',
                      }
                    }
                  }} 
                  data={{
                    labels: chartData[activeTab].labels.filter((label) => {
                      if (label.toLowerCase().includes('youtube')) return connections.youtube;
                      if (label.toLowerCase().includes('instagram')) return connections.instagram;
                      if (label.toLowerCase().includes('tiktok')) return connections.tiktok;
                      return false;
                    }),
                    datasets: [{
                      data: chartData[activeTab].datasets[0].data.filter((_, index) => {
                        const label = chartData[activeTab].labels[index];
                        if (label.toLowerCase().includes('youtube')) return connections.youtube;
                        if (label.toLowerCase().includes('instagram')) return connections.instagram;
                        if (label.toLowerCase().includes('tiktok')) return connections.tiktok;
                        return false;
                      }),
                      backgroundColor: chartData[activeTab].datasets[0].backgroundColor.filter((_, index) => {
                        const label = chartData[activeTab].labels[index];
                        if (label.toLowerCase().includes('youtube')) return connections.youtube;
                        if (label.toLowerCase().includes('instagram')) return connections.instagram;
                        if (label.toLowerCase().includes('tiktok')) return connections.tiktok;
                        return false;
                      }),
                      borderColor: chartData[activeTab].datasets[0].borderColor.filter((_, index) => {
                        const label = chartData[activeTab].labels[index];
                        if (label.toLowerCase().includes('youtube')) return connections.youtube;
                        if (label.toLowerCase().includes('instagram')) return connections.instagram;
                        if (label.toLowerCase().includes('tiktok')) return connections.tiktok;
                        return false;
                      }),
                      borderWidth: 1
                    }]
                  }} 
                />
              ) : (
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
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 