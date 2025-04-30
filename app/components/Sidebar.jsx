'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../lib/auth';
import { 
  ChartBarIcon,
  FolderIcon, 
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const socialStats = [
  { name: 'YouTube', count: '23k', href: '/youtube', color: 'text-red-500' },
  { name: 'Instagram', count: '23k', href: '/instagram', color: 'text-pink-500' },
  { name: 'TikTok', count: '23k', href: '/tiktok', color: 'text-gray-900' },
];

const navigation = [
  { name: 'Projects', href: '/projects', icon: FolderIcon },
  { name: 'Profile', href: '/profile', icon: UserCircleIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

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
            {socialStats.map((platform) => (
              <Link
                key={platform.name}
                href={platform.href}
                className={`flex items-center justify-between py-2 px-2 rounded-md mb-1 ${
                  pathname === platform.href
                    ? 'bg-gray-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span className={`text-sm font-medium ${platform.color}`}>
                  {platform.name}
                </span>
                <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded">
                  {platform.count}
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