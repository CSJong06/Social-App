'use client';

import Link from 'next/link';

export default function AuthHeader() {
  return (
    <header className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 relative overflow-hidden">
      {/* Add subtle pattern overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl tracking-tight">
              Social Analytics
            </h1>
          </Link>
          <p className="mt-4 text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
            Track your social media growth, analyze engagement metrics, and optimize your content strategy with powerful analytics tools.
          </p>
        </div>
      </div>
    </header>
  );
} 