'use client';

import { useState } from 'react';
import { BookmarkIcon } from '@heroicons/react/24/outline';

export default function ContentSuggestionForm() {
  const [formData, setFormData] = useState({
    topic: '',
    platform: 'instagram',
    tone: 'professional'
  });
  const [suggestions, setSuggestions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('/api/content-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate suggestions');
      }

      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (err) {
      setError('Failed to generate suggestions. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (suggestion) => {
    try {
      const response = await fetch('/api/content-suggestions/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: suggestion.split('\n')[0],
          description: suggestion,
          platform: formData.platform,
          tone: formData.tone
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save suggestion');
      }

      setSuccess('Suggestion saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save suggestion. Please try again.');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">AI Content Suggestions</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Topic</label>
          <input
            type="text"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            placeholder="e.g., fitness, fashion, tech"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Platform</label>
          <select
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tone</label>
          <select
            name="tone"
            value={formData.tone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="humorous">Humorous</option>
            <option value="educational">Educational</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Generating...' : 'Generate Suggestion'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      {suggestions && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3">Generated Suggestion</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded">
              <div className="whitespace-pre-wrap">{suggestions}</div>
              <button
                onClick={() => handleSave(suggestions)}
                className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
              >
                <BookmarkIcon className="h-5 w-5 mr-1" />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 