'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  UserCircleIcon,
  PencilIcon,
  LinkIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

export default function Profile() {
  const { data: session } = useSession();
  const [socialConnections, setSocialConnections] = useState([
    {
      platform: 'Instagram',
      username: '@johndoe',
      connected: true
    },
    {
      platform: 'Twitter',
      username: '@johndoe',
      connected: true
    }
  ]);

  return (
    <div className="max-w-4xl p-8 mx-auto">
      {/* Profile Header */}
      <div className="flex items-center mb-8">
        <div className="flex-shrink-0">
          <UserCircleIcon className="w-24 h-24 text-gray-400" />
        </div>
        <div className="ml-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {session?.user?.name || 'User Name'}
          </h1>
          <p className="text-gray-600">{session?.user?.email}</p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-8">
        {/* Personal Information */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
            <button className="btn-secondary">
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={session?.user?.name || ''}
                readOnly
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={session?.user?.email || ''}
                readOnly
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Social Connections */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Social Media Connections</h2>
            <button className="btn-primary">
              <LinkIcon className="w-4 h-4 mr-2" />
              Connect Account
            </button>
          </div>
          <div className="space-y-4">
            {socialConnections.map((connection) => (
              <div
                key={connection.platform}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center">
                  <img
                    src={`/${connection.platform.toLowerCase()}-icon.png`}
                    alt={connection.platform}
                    className="w-8 h-8"
                  />
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">{connection.platform}</p>
                    <p className="text-sm text-gray-600">{connection.username}</p>
                  </div>
                </div>
                <button className="btn-secondary text-red-600 hover:text-red-700">
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Disconnect
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Preferences</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive email updates about your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Dark Mode</p>
                <p className="text-sm text-gray-600">Use dark theme across the application</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 