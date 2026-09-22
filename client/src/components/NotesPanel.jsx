import React, { useState, useEffect } from 'react';
import client from '../api/client';

export default function NotesPanel({ moduleId, isOpen, onClose }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('general');

  const categories = ['general', 'important', 'question', 'doubt'];

  useEffect(() => {
    if (isOpen && moduleId) {
      fetchNotes();
    }
  }, [isOpen, moduleId]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await client.get(`/notes/module/${moduleId}`);
      setNotes(response.data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) {
      return;
    }

    try {
      const response = await client.post('/notes', {
        moduleId,
        title: newNoteTitle,
        content: newNoteContent,
        category: selectedCategory
      });

      setNotes([response.data, ...notes]);
      setNewNoteTitle('');
      setNewNoteContent('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await client.delete(`/notes/${noteId}`);
      setNotes(notes.filter(n => n.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleUpdateNote = async (noteId, updatedContent) => {
    try {
      const response = await client.put(`/notes/${noteId}`, {
        content: updatedContent
      });

      setNotes(notes.map(n => n.id === noteId ? response.data : n));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-slate-900/95 border-l border-slate-800 backdrop-blur-xl shadow-2xl z-50 flex flex-col animate-fade-in-up">
      {/* Header */}
      <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl">📝</span>
          <h2 className="text-base font-bold text-white">Study Notes</h2>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white text-lg hover:bg-slate-800 w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition"
        >
          ✕
        </button>
      </div>

      {/* Add Note Section */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/40 space-y-2.5">
        <input
          type="text"
          placeholder="Note title..."
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
          className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
        />
        <textarea
          placeholder="Write your study notes here..."
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 resize-none"
        />
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-400"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>#{cat}</option>
            ))}
          </select>
          <button
            onClick={handleAddNote}
            disabled={!newNoteTitle.trim() || !newNoteContent.trim()}
            className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold rounded-xl transition text-xs cursor-pointer"
          >
            Save Note
          </button>
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <p className="text-center text-slate-400 text-xs py-8">Loading notes...</p>
        ) : notes.length === 0 ? (
          <div className="text-center py-12 px-4">
            <span className="text-3xl block mb-2">✍️</span>
            <p className="text-slate-300 font-medium text-xs">No notes for this module yet</p>
            <p className="text-slate-500 text-[11px] mt-1">Jot down quick reminders, questions, or important concepts above.</p>
          </div>
        ) : (
          notes.map(note => (
            <div
              key={note.id}
              className="p-3.5 rounded-xl border bg-slate-950/60 border-slate-800 hover:border-slate-700 space-y-2 transition"
            >
              {editingId === note.id ? (
                <div className="space-y-2">
                  <textarea
                    value={note.content}
                    onChange={(e) => {
                      const updatedNotes = notes.map(n =>
                        n.id === note.id ? { ...n, content: e.target.value } : n
                      );
                      setNotes(updatedNotes);
                    }}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white resize-none focus:outline-none focus:border-emerald-400"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateNote(note.id, note.content)}
                      className="text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1 rounded-lg transition cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white">{note.title}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700 font-semibold uppercase">
                      #{note.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{note.content}</p>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-800/60 text-[11px]">
                    <span className="text-slate-500">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setEditingId(note.id)}
                        className="text-emerald-400 hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-red-400 hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
