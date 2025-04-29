'use client';

import { useState } from 'react';
import { 
  PencilIcon, 
  ChatBubbleLeftIcon,
  ShareIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

export default function ProjectDetail({ params }) {
  const [content, setContent] = useState('');
  const [suggestions, setSuggestions] = useState([
    {
      id: 1,
      text: 'Consider adding more engaging call-to-actions',
      timestamp: new Date().toISOString()
    },
    {
      id: 2,
      text: 'Your content could benefit from more visual elements',
      timestamp: new Date().toISOString()
    }
  ]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
    // TODO: Implement AI suggestions based on content changes
  };

  return (
    <div className="flex h-full">
      {/* Main content area */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Blog Content Strategy</h1>
            <p className="mt-1 text-sm text-gray-600">
              Last edited 2 hours ago
            </p>
          </div>
          <div className="flex space-x-4">
            <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
              <ShareIcon className="w-5 h-5 mr-2" />
              Share
            </button>
            <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700">
              <TrashIcon className="w-5 h-5 mr-2" />
              Delete
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="p-6 bg-white rounded-lg shadow">
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Start writing your content..."
            className="w-full h-96 p-4 text-gray-900 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* AI Suggestions sidebar */}
      <div className="w-80 border-l bg-gray-50 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">AI Suggestions</h2>
          <button className="text-sm text-indigo-600 hover:text-indigo-500">
            Refresh
          </button>
        </div>

        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="p-4 bg-white rounded-lg shadow"
            >
              <p className="text-sm text-gray-600">{suggestion.text}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">
                  {new Date(suggestion.timestamp).toLocaleTimeString()}
                </span>
                <button className="text-xs text-indigo-600 hover:text-indigo-500">
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>

        {suggestions.length === 0 && (
          <div className="text-center py-6">
            <ChatBubbleLeftIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No suggestions yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start writing to get AI-powered suggestions
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 