'use client';

import Link from 'next/link';
import { PlusIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Projects() {
  const projects = [
    { id: 1, name: 'Blog', description: 'Personal blog website' },
    { id: 2, name: 'Video Browser', description: 'Video browsing application' },
    { id: 3, name: 'Accounting', description: 'Financial management system' },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link
          href="/dashboard"
          className="mr-4 p-2 text-gray-400 hover:text-gray-500"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-semibold flex-1">Projects</h1>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {project.name}
              </h3>
              <p className="text-gray-500">{project.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 