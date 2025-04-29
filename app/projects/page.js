'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function Projects() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'Blog Content Strategy',
      description: 'Content planning and strategy for the company blog',
      updatedAt: '2024-02-20'
    },
    {
      id: 2,
      title: 'Social Media Campaign',
      description: 'Q1 marketing campaign across all platforms',
      updatedAt: '2024-02-19'
    },
    // Add more sample projects
  ]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your content projects and collaborations
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <PlusIcon className="w-5 h-5 mr-2" />
          New Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="block p-6 transition bg-white rounded-lg shadow hover:shadow-md"
          >
            <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{project.description}</p>
            <p className="mt-4 text-sm text-gray-500">
              Last updated: {new Date(project.updatedAt).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg">
          <div className="w-16 h-16 mb-4 text-gray-400">
            <DocumentTextIcon />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No projects yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new project
          </p>
          <button className="inline-flex items-center px-4 py-2 mt-4 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <PlusIcon className="w-5 h-5 mr-2" />
            New Project
          </button>
        </div>
      )}
    </div>
  );
} 