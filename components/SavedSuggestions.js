'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function SavedSuggestions() {
  const { data: session } = useSession();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    platform: '',
    tone: ''
  });

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch('/api/content-suggestions/list');
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (err) {
      setError('Failed to load suggestions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/content-suggestions/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete suggestion');
      await fetchSuggestions();
    } catch (err) {
      setError('Failed to delete suggestion');
      console.error(err);
    }
  };

  const handleEdit = (suggestion) => {
    setEditingId(suggestion._id);
    setEditForm({
      title: suggestion.title,
      description: suggestion.description,
      platform: suggestion.platform,
      tone: suggestion.tone
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/content-suggestions/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });
      if (!response.ok) throw new Error('Failed to update suggestion');
      setEditingId(null);
      await fetchSuggestions();
    } catch (err) {
      setError('Failed to update suggestion');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center">Loading suggestions...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Saved Suggestions</h2>
      {suggestions.length === 0 ? (
        <p className="text-gray-500 text-center">No saved suggestions yet</p>
      ) : (
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div key={suggestion._id} className="border rounded-lg p-4">
              {editingId === suggestion._id ? (
                <form onSubmit={handleUpdate} className="space-y-3">
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Title"
                  />
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Description"
                    rows="3"
                  />
                  <select
                    value={editForm.platform}
                    onChange={(e) => setEditForm({ ...editForm, platform: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                    <option value="twitter">Twitter</option>
                  </select>
                  <select
                    value={editForm.tone}
                    onChange={(e) => setEditForm({ ...editForm, tone: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="humorous">Humorous</option>
                    <option value="educational">Educational</option>
                  </select>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="font-semibold">{suggestion.title}</h3>
                  <p className="text-gray-600 mt-2">{suggestion.description}</p>
                  <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                    <span>{suggestion.platform}</span>
                    <span>•</span>
                    <span>{suggestion.tone}</span>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={() => handleEdit(suggestion)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(suggestion._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 