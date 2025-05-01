'use client';

import { useState, useEffect } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../lib/auth';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '********',
  });
  const [editedData, setEditedData] = useState({
    name: '',
    email: '',
  });
  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
  });
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/users/me', {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData({
          name: data.name,
          email: data.email,
          password: '********',
        });
        setEditedData({
          name: data.name,
          email: data.email,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Initialize state with localStorage data if available
  const [socialConnections, setSocialConnections] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedConnections = localStorage.getItem('socialConnections');
      return savedConnections ? JSON.parse(savedConnections) : {
        youtube: false,
        instagram: false,
        tiktok: false
      };
    }
    return {
      youtube: false,
      instagram: false,
      tiktok: false
    };
  });

  const [isConnecting, setIsConnecting] = useState({
    youtube: false,
    instagram: false,
    tiktok: false
  });

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState({
    youtube: false,
    instagram: false,
    tiktok: false
  });

  // Save social connections to localStorage when they change
  useEffect(() => {
    localStorage.setItem('socialConnections', JSON.stringify(socialConnections));
  }, [socialConnections]);

  const handleConnect = async (platform) => {
    if (socialConnections[platform]) {
      setShowDisconnectConfirm(prev => ({ ...prev, [platform]: true }));
      return;
    }

    setIsConnecting(prev => ({ ...prev, [platform]: true }));
    
    try {
      const response = await fetch(`/api/users/social/${platform}/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to connect ${platform}`);
      }

      setSocialConnections(prev => ({
        ...prev,
        [platform]: true
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsConnecting(prev => ({ ...prev, [platform]: false }));
    }
  };

  const handleDisconnect = async (platform) => {
    try {
      const response = await fetch(`/api/users/social/${platform}/disconnect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to disconnect ${platform}`);
      }

      setSocialConnections(prev => ({
        ...prev,
        [platform]: false
      }));
      setShowDisconnectConfirm(prev => ({ ...prev, [platform]: false }));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReset = async () => {
    try {
      const response = await fetch('/api/users/social/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to reset connections');
      }

      setSocialConnections({
        youtube: false,
        instagram: false,
        tiktok: false
      });
      localStorage.removeItem('socialConnections');
      setShowResetConfirm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (field) => {
    setIsEditing(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleCancel = (field) => {
    setIsEditing(prev => ({
      ...prev,
      [field]: false
    }));
    setEditedData(prev => ({
      ...prev,
      [field]: userData[field]
    }));
    setSaveError(null);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user data');
      }

      setUserData(prev => ({
        ...prev,
        ...editedData
      }));
      setIsEditing({
        name: false,
        email: false,
      });
      setShowSaveConfirm(false);
      setSaveError(null);
    } catch (err) {
      setSaveError(err.message);
    }
  };

  const handlePasswordEdit = () => {
    setShowPasswordConfirm(true);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError(null);
  };

  const handlePasswordSave = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/users/me/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update password');
      }

      setShowPasswordConfirm(false);
      setPasswordError(null);
    } catch (err) {
      setPasswordError(err.message);
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordConfirm(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Profile</h1>
      
      {/* Save Confirmation Dialog */}
      {showSaveConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Save Changes</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to save these changes to your profile?</p>
            {saveError && (
              <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <strong className="font-bold">Error! </strong>
                <span className="block sm:inline">{saveError}</span>
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSaveConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Reset All Connections</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to disconnect all social media accounts? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disconnect Confirmation Dialogs */}
      {Object.entries(showDisconnectConfirm).map(([platform, show]) => {
        if (!show) return null;
        return (
          <div key={platform} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Disconnect {platform.charAt(0).toUpperCase() + platform.slice(1)}</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to disconnect your {platform} account? This will remove it from your dashboard.</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDisconnectConfirm(prev => ({ ...prev, [platform]: false }))}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDisconnect(platform)}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Password Confirmation Dialog */}
      {showPasswordConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              {passwordError && (
                <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  <strong className="font-bold">Error! </strong>
                  <span className="block sm:inline">{passwordError}</span>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handlePasswordCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSave}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

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
                  <div className="relative">
                    <input
                      type="text"
                      value={isEditing.name ? editedData.name : userData.name}
                      onChange={(e) => setEditedData(prev => ({ ...prev, name: e.target.value }))}
                      readOnly={!isEditing.name}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm ${
                        isEditing.name 
                          ? 'border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500' 
                          : 'border-gray-300 bg-gray-50'
                      }`}
                    />
                    {isEditing.name ? (
                      <div className="absolute right-0 top-0 h-full flex items-center pr-2 space-x-1">
                        <button
                          onClick={() => setShowSaveConfirm(true)}
                          className="text-green-600 hover:text-green-700"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => handleCancel('name')}
                          className="text-red-600 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit('name')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        ✎
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={userData.password}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                    />
                    <button
                      onClick={handlePasswordEdit}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✎
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={isEditing.email ? editedData.email : userData.email}
                    onChange={(e) => setEditedData(prev => ({ ...prev, email: e.target.value }))}
                    readOnly={!isEditing.email}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm ${
                      isEditing.email 
                        ? 'border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500' 
                        : 'border-gray-300 bg-gray-50'
                    }`}
                  />
                  {isEditing.email ? (
                    <div className="absolute right-0 top-0 h-full flex items-center pr-2 space-x-1">
                      <button
                        onClick={() => setShowSaveConfirm(true)}
                        className="text-green-600 hover:text-green-700"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => handleCancel('email')}
                        className="text-red-600 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit('email')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✎
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Connections */}
          <div className="space-y-4 mb-8">
            <h2 className="text-lg font-medium text-gray-900">Social Media Connections</h2>
            {['YouTube', 'Instagram', 'TikTok'].map((platform) => {
              const platformKey = platform.toLowerCase();
              const isConnected = socialConnections[platformKey];
              const isLoading = isConnecting[platformKey];
              
              return (
                <div key={platform} className="flex items-center justify-between py-3 border-b">
                  <span className="text-sm font-medium text-gray-900">{platform}</span>
                  <button
                    onClick={() => handleConnect(platformKey)}
                    disabled={isLoading}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      isConnected
                        ? 'text-red-700 bg-red-50 hover:bg-red-100'
                        : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100'
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Connecting...
                      </span>
                    ) : isConnected ? (
                      'Disconnect'
                    ) : (
                      'Connect'
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Reset Button */}
          <div className="border-t pt-6">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 max-w-[200px] mx-auto block"
            >
              Reset All Connections
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 