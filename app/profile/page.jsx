'use client';

import { useState } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/outline';

export default function Profile() {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    password: '********',
  });

  const [socialConnections, setSocialConnections] = useState({
    youtube: false,
    instagram: false,
    tiktok: false
  });

  const handleConnect = (platform) => {
    setSocialConnections(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  const handleReset = () => {
    // Reset form implementation
    console.log('Resetting form...');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Profile</h1>
      
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          {/* User Info Section */}
          <div className="flex items-start space-x-8 mb-8">
            <UserCircleIcon className="h-20 w-20 text-gray-400" />
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={user.password}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Social Media Connections */}
          <div className="space-y-4 mb-8">
            <h2 className="text-lg font-medium text-gray-900">Social Media Connections</h2>
            {['YouTube', 'Instagram', 'TikTok'].map((platform) => (
              <div key={platform} className="flex items-center justify-between py-3 border-b">
                <span className="text-sm font-medium text-gray-900">{platform}</span>
                <button
                  onClick={() => handleConnect(platform.toLowerCase())}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    socialConnections[platform.toLowerCase()]
                      ? 'bg-gray-200 text-gray-700'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {socialConnections[platform.toLowerCase()] ? 'Connected' : 'Connect'}
                </button>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
            <button className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 