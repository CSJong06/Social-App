'use client';

import { useState } from 'react';
import ContentSuggestionForm from '@/components/ContentSuggestionForm';
import SavedSuggestions from '@/components/SavedSuggestions';

export default function ContentSuggestionsPage() {
  const [activeTab, setActiveTab] = useState('generate');

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">AI Content Suggestions</h1>
      
      {/* Tabs */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('generate')}
              className={`${
                activeTab === 'generate'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Generate Suggestions
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`${
                activeTab === 'saved'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Saved Suggestions
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl mx-auto">
        {activeTab === 'generate' ? (
          <ContentSuggestionForm />
        ) : (
          <SavedSuggestions />
        )}
      </div>
    </div>
  );
} 