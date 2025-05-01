'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../lib/auth';
import { 
  ChartBarIcon,
  FolderIcon, 
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const socialPlatforms = [
  { 
    name: 'YouTube', 
    href: '/youtube', 
    color: 'text-red-500',
    hoverColor: 'hover:text-red-600',
    bgColor: 'bg-red-50',
    hoverBgColor: 'hover:bg-red-50',
    key: 'youtube',
    icon: () => (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  { 
    name: 'Instagram', 
    href: '/instagram', 
    color: 'text-pink-500',
    hoverColor: 'hover:text-pink-600',
    bgColor: 'bg-pink-50',
    hoverBgColor: 'hover:bg-pink-50',
    key: 'instagram',
    icon: () => (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  { 
    name: 'TikTok', 
    href: '/tiktok', 
    color: 'text-gray-800',
    hoverColor: 'hover:text-gray-900',
    bgColor: 'bg-gray-50',
    hoverBgColor: 'hover:bg-gray-50',
    key: 'tiktok',
    icon: () => (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </svg>
    ),
  },
];

const navigation = [
  { name: 'Projects', href: '/projects', icon: FolderIcon },
  { name: 'Profile', href: '/profile', icon: UserCircleIcon },
];

function formatCount(count) {
  if (!count) return '0';
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
}

export default function Sidebar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [socialStats, setSocialStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSocialStats = async () => {
      try {
        const response = await fetch('/api/analytics/summary');
        if (response.ok) {
          const data = await response.json();
          setSocialStats(data);
        }
      } catch (error) {
        console.error('Error fetching social stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSocialStats();
  }, []);

  // Don't show sidebar on auth pages or when not authenticated
  if (pathname.startsWith('/auth') || !user?.isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col w-64 bg-white border-r">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 mb-5">
          <h1 className="text-xl font-semibold">Social App</h1>
        </div>

        {/* Dashboard Section with Social Stats */}
        <div className="px-3 mb-6">
          {/* Dashboard Link */}
          <Link
            href="/dashboard"
            className={`${
              pathname === '/dashboard'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            } group flex items-center px-2 py-2 text-sm font-medium rounded-md mb-1`}
          >
            <ChartBarIcon
              className={`${
                pathname === '/dashboard' ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
              } mr-3 flex-shrink-0 h-6 w-6`}
            />
            Dashboard
          </Link>

          {/* Indented Social Links */}
          <div className="ml-8">
            {socialPlatforms.map((platform) => (
              <Link
                key={platform.name}
                href={platform.href}
                className={`flex items-center justify-between py-2 px-3 rounded-md mb-2 transition-colors duration-150 ${platform.color} ${
                  pathname === platform.href
                    ? platform.bgColor
                    : platform.hoverBgColor
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>
                    <platform.icon />
                  </span>
                  <span className="text-sm font-medium">
                    {platform.name}
                  </span>
                </div>
                <span className={`text-sm font-semibold px-2 py-1 rounded ${
                  pathname === platform.href 
                    ? 'bg-white/50' 
                    : 'bg-white/80'
                }`}>
                  {isLoading ? '...' : formatCount(socialStats[platform.key]?.count)}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="px-3 flex-1">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md mb-1`}
              >
                <item.icon
                  className={`${
                    isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                  } mr-3 flex-shrink-0 h-6 w-6`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="px-3 mt-auto">
          <button
            onClick={logout}
            className="w-full flex items-center px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md group"
          >
            <ArrowRightOnRectangleIcon
              className="mr-3 flex-shrink-0 h-6 w-6 text-red-400 group-hover:text-red-500"
              aria-hidden="true"
            />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
} 