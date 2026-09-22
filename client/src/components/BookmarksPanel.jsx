import React, { useState, useEffect } from 'react';
import client from '../api/client';

export default function BookmarksPanel({ moduleId, isOpen, onClose }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  useEffect(() => {
    if (isOpen && moduleId) {
      fetchBookmarks();
    }
  }, [isOpen, moduleId]);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const response = await client.get(`/bookmarks/module/${moduleId}`);
      setBookmarks(response.data || []);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBookmark = async () => {
    if (!selectedText.trim()) return;

    try {
      const response = await client.post('/bookmarks', {
        moduleId,
        highlightedText: selectedText,
        pageNumber: 0,
        tags: []
      });

      setBookmarks([response.data, ...bookmarks]);
      setSelectedText('');
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  };

  const handleDeleteBookmark = async (bookmarkId) => {
    try {
      await client.delete(`/bookmarks/${bookmarkId}`);
      setBookmarks(bookmarks.filter(b => b.id !== bookmarkId));
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-slate-900/95 border-l border-slate-800 backdrop-blur-xl shadow-2xl z-50 flex flex-col animate-fade-in-up">
      {/* Header */}
      <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl">📌</span>
          <h2 className="text-base font-bold text-white">Module Bookmarks</h2>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white text-lg hover:bg-slate-800 w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition"
        >
          ✕
        </button>
      </div>

      {/* Add Bookmark Section */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/40">
        <label className="block text-xs font-semibold text-slate-400 mb-2">Save a Key Note / Highlight</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Paste or type text to bookmark..."
            value={selectedText}
            onChange={(e) => setSelectedText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAddBookmark(); }}
            className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
          />
          <button
            onClick={handleAddBookmark}
            disabled={!selectedText.trim()}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold rounded-xl transition text-xs cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>

      {/* Bookmarks List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <p className="text-center text-slate-400 text-xs py-8">Loading bookmarks...</p>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-12 px-4">
            <span className="text-3xl block mb-2">📌</span>
            <p className="text-slate-300 font-medium text-xs">No bookmarks yet</p>
            <p className="text-slate-500 text-[11px] mt-1">Highlight important concepts while reading and save them here!</p>
          </div>
        ) : (
          bookmarks.map(bookmark => (
            <div key={bookmark.id} className="bg-slate-950/60 border border-slate-800 hover:border-slate-700 p-3.5 rounded-xl transition space-y-2">
              <p className="text-xs text-slate-200 leading-relaxed font-mono bg-slate-900/80 p-2 rounded-lg border border-slate-800/80">
                {bookmark.text}
              </p>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-500">
                  {new Date(bookmark.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleDeleteBookmark(bookmark.id)}
                  className="text-red-400 hover:text-red-300 font-medium hover:underline cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
