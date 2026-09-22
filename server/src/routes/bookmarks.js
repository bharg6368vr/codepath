const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getStore, updateStore } = require('../db/store');
const authMiddleware = require('../middleware/auth');

// Get user's bookmarks
router.get('/', authMiddleware, (req, res) => {
  try {
    const store = getStore();
    const userBookmarks = store.bookmarks?.filter(b => b.userId === req.user.id) || [];
    res.json(userBookmarks);
  } catch (error) {
    console.error('Bookmarks fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get bookmarks for a specific module
router.get('/module/:moduleId', authMiddleware, (req, res) => {
  try {
    const { moduleId } = req.params;
    const store = getStore();
    
    const bookmarks = store.bookmarks?.filter(
      b => b.userId === req.user.id && b.moduleId === moduleId
    ) || [];
    
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create bookmark
router.post('/', authMiddleware, (req, res) => {
  try {
    const { moduleId, highlightedText, pageNumber, tags } = req.body;
    
    if (!moduleId || !highlightedText) {
      return res.status(400).json({ error: 'moduleId and highlightedText are required' });
    }
    
    const store = getStore();
    store.bookmarks = store.bookmarks || [];
    
    const bookmark = {
      id: uuidv4(),
      userId: req.user.id,
      moduleId,
      text: highlightedText,
      pageNumber: pageNumber || 0,
      tags: tags || [],
      createdAt: new Date().toISOString()
    };
    
    store.bookmarks.push(bookmark);
    updateStore(store);
    
    res.status(201).json(bookmark);
  } catch (error) {
    console.error('Bookmark create error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete bookmark
router.delete('/:bookmarkId', authMiddleware, (req, res) => {
  try {
    const { bookmarkId } = req.params;
    const store = getStore();
    
    const bookmarkIndex = store.bookmarks?.findIndex(
      b => b.id === bookmarkId && b.userId === req.user.id
    );
    
    if (bookmarkIndex === -1) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    
    store.bookmarks.splice(bookmarkIndex, 1);
    updateStore(store);
    
    res.json({ success: true, message: 'Bookmark deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update bookmark tags
router.put('/:bookmarkId', authMiddleware, (req, res) => {
  try {
    const { bookmarkId } = req.params;
    const { tags } = req.body;
    const store = getStore();
    
    const bookmark = store.bookmarks?.find(
      b => b.id === bookmarkId && b.userId === req.user.id
    );
    
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    
    bookmark.tags = tags || bookmark.tags;
    updateStore(store);
    
    res.json(bookmark);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
