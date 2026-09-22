const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getStore, updateStore } = require('../db/store');
const authMiddleware = require('../middleware/auth');

// Get all notes for user
router.get('/', authMiddleware, (req, res) => {
  try {
    const store = getStore();
    const userNotes = store.userNotes?.filter(n => n.userId === req.user.id) || [];
    res.json(userNotes);
  } catch (error) {
    console.error('Notes fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get notes for a specific module
router.get('/module/:moduleId', authMiddleware, (req, res) => {
  try {
    const { moduleId } = req.params;
    const store = getStore();
    
    const notes = store.userNotes?.filter(
      n => n.userId === req.user.id && n.moduleId === moduleId
    ) || [];
    
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create note
router.post('/', authMiddleware, (req, res) => {
  try {
    const { moduleId, title, content, category } = req.body;
    
    if (!moduleId || !title || !content) {
      return res.status(400).json({ error: 'moduleId, title, and content are required' });
    }
    
    const store = getStore();
    store.userNotes = store.userNotes || [];
    
    const note = {
      id: uuidv4(),
      userId: req.user.id,
      moduleId,
      title,
      content,
      category: category || 'general',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    store.userNotes.push(note);
    updateStore(store);
    
    res.status(201).json(note);
  } catch (error) {
    console.error('Note create error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single note
router.get('/:noteId', authMiddleware, (req, res) => {
  try {
    const { noteId } = req.params;
    const store = getStore();
    
    const note = store.userNotes?.find(
      n => n.id === noteId && n.userId === req.user.id
    );
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update note
router.put('/:noteId', authMiddleware, (req, res) => {
  try {
    const { noteId } = req.params;
    const { title, content, category } = req.body;
    const store = getStore();
    
    const note = store.userNotes?.find(
      n => n.id === noteId && n.userId === req.user.id
    );
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    note.title = title || note.title;
    note.content = content || note.content;
    note.category = category || note.category;
    note.updatedAt = new Date().toISOString();
    
    updateStore(store);
    res.json(note);
  } catch (error) {
    console.error('Note update error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete note
router.delete('/:noteId', authMiddleware, (req, res) => {
  try {
    const { noteId } = req.params;
    const store = getStore();
    
    const noteIndex = store.userNotes?.findIndex(
      n => n.id === noteId && n.userId === req.user.id
    );
    
    if (noteIndex === -1) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    store.userNotes.splice(noteIndex, 1);
    updateStore(store);
    
    res.json({ success: true, message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get notes by category
router.get('/category/:category', authMiddleware, (req, res) => {
  try {
    const { category } = req.params;
    const store = getStore();
    
    const notes = store.userNotes?.filter(
      n => n.userId === req.user.id && n.category === category
    ) || [];
    
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
