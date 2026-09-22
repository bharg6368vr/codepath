const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getStore, updateStore } = require('../db/store');
const authMiddleware = require('../middleware/auth');
const axios = require('axios');

// Fetch next welcome stage
router.post('/next-stage', async (req, res) => {
  try {
    const { stage, response } = req.body;
    
    const ragsResponse = await axios.post('http://localhost:5001/api/welcome/next-stage', {
      stage,
      response
    });
    
    res.json(ragsResponse.data);
  } catch (error) {
    console.error('Onboarding error:', error.message);
    // Fallback response if RAG service is unavailable
    const stages = ["greeting", "personality", "goal", "motivation"];
    const currentIdx = stages.indexOf(req.body.stage);
    const nextIdx = currentIdx + 1;
    
    if (nextIdx >= stages.length) {
      return res.json({
        stage: "complete",
        message: "Let's start learning! Pick a language:",
        action: "redirect_to_languages"
      });
    }
    
    res.json({
      stage: stages[nextIdx],
      messages: ["Great progress!", "Let's continue"],
      options: ["Option 1", "Option 2"],
      delay: 1.5
    });
  }
});

// Get personalized language recommendation
router.post('/recommend-language', async (req, res) => {
  try {
    const { personality, goal } = req.body;
    
    const recommendation = await axios.post(
      'http://localhost:5001/api/welcome/personalize-recommendation',
      { personality, goal }
    );
    
    res.json(recommendation.data);
  } catch (error) {
    console.error('Recommendation error:', error.message);
    // Fallback recommendation
    res.json({
      recommendedLanguage: "python",
      reason: "Python is a great language to start with!",
      message: "Let's start with Python! But feel free to pick any language 🎯"
    });
  }
});

// Save onboarding state (after user completes)
router.post('/save-state', authMiddleware, (req, res) => {
  try {
    const { personality, goal } = req.body;
    const store = getStore();
    
    store.onboardingState = store.onboardingState || [];
    const existingState = store.onboardingState.find(o => o.userId === req.user.id);
    
    if (existingState) {
      existingState.personalityType = personality;
      existingState.goal = goal;
      existingState.completed = true;
      existingState.completedAt = new Date().toISOString();
    } else {
      store.onboardingState.push({
        userId: req.user.id,
        stage: 'complete',
        completed: true,
        personalityType: personality,
        goal,
        completedAt: new Date().toISOString(),
        conversationHistory: []
      });
    }
    
    updateStore(store);
    res.json({ success: true, message: 'Onboarding completed!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save user onboarding preferences
router.post('/preferences', authMiddleware, (req, res) => {
  try {
    const { goal, experienceLevel, learningStyle } = req.body;
    const store = getStore();

    store.userPreferences = store.userPreferences || [];
    const existing = store.userPreferences.find(p => p.userId === req.user.id);

    if (existing) {
      existing.goal = goal;
      existing.experienceLevel = experienceLevel;
      existing.learningStyle = learningStyle;
      existing.updatedAt = new Date().toISOString();
    } else {
      store.userPreferences.push({
        userId: req.user.id,
        goal,
        experienceLevel,
        learningStyle,
        createdAt: new Date().toISOString()
      });
    }

    updateStore(store);
    res.json({ success: true, message: 'Preferences saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's onboarding status
router.get('/status', authMiddleware, (req, res) => {
  try {
    const store = getStore();
    const onboardingState = store.onboardingState?.find(o => o.userId === req.user.id);
    
    if (!onboardingState) {
      return res.json({ completed: false, personality: null, goal: null });
    }
    
    res.json({
      completed: onboardingState.completed,
      personality: onboardingState.personalityType,
      goal: onboardingState.goal
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
