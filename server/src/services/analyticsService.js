const { getStore, updateStore } = require('../db/store');

class AnalyticsService {
  static trackActivity(userId, activityType, metadata = {}) {
    if (!userId) return;
    const store = getStore();
    store.analytics = store.analytics || [];
    
    store.analytics.push({
      userId,
      activityType, // 'module_completed', 'quiz_submitted', 'certificate_earned', 'login', etc.
      metadata,
      date: new Date().toISOString(),
      timestamp: Date.now()
    });
    
    updateStore(store);
  }

  static calculateLeaderboard(limit = 50) {
    const store = getStore();
    const users = store.users || [];
    const certificates = store.certificates || [];
    const quizAttempts = store.quizAttempts || [];
    const progressList = store.progress || [];

    const leaderboard = users.map(user => {
      const userCerts = certificates.filter(c => c.userId === user.id);
      const userQuizzes = quizAttempts.filter(q => q.userId === user.id && q.score !== null && q.score !== undefined);
      const userProgress = progressList.filter(p => p.userId === user.id);
      const completedModules = userProgress.reduce((sum, p) => sum + (p.completedModuleIds?.length || 0), 0);

      const avgScore = userQuizzes.length > 0
        ? Math.round(userQuizzes.reduce((sum, q) => sum + q.score, 0) / userQuizzes.length)
        : 0;

      // Weighted score: Certs (100 pts) + Quiz Avg (2x) + Completed Modules (10 pts)
      const score = (userCerts.length * 100) + (avgScore * 2) + (completedModules * 10);

      return {
        userId: user.id,
        name: user.name || user.email?.split('@')[0] || 'Learner',
        certificatesCount: userCerts.length,
        averageScore: avgScore,
        quizzesTaken: userQuizzes.length,
        completedModules,
        score,
      };
    })
    .sort((a, b) => b.score - a.score || b.completedModules - a.completedModules)
    .slice(0, limit)
    .map((entry, idx) => ({
      ...entry,
      rank: idx + 1
    }));

    return leaderboard;
  }

  static getUserRank(userId) {
    const leaderboard = this.calculateLeaderboard(1000);
    return leaderboard.find(entry => entry.userId === userId)?.rank || null;
  }

  static getConceptStruggle(userId) {
    const store = getStore();
    const userQuizzes = store.quizAttempts?.filter(q => q.userId === userId) || [];
    
    const conceptScores = {};
    
    userQuizzes.forEach(quiz => {
      const language = store.languages?.find(l => l.id === quiz.languageId);
      
      quiz.questions?.forEach((q) => {
        const userAnswer = quiz.userAnswers?.[q.id];
        const isCorrect = typeof userAnswer === 'string' && typeof q.correctAnswer === 'string' &&
          userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
        
        const concept = q.sourceModule || `${language?.name || 'Code'} - Concept`;
        conceptScores[concept] = conceptScores[concept] || { correct: 0, total: 0 };
        conceptScores[concept].total++;
        if (isCorrect) conceptScores[concept].correct++;
      });
    });

    return Object.entries(conceptScores)
      .map(([concept, scores]) => ({
        concept,
        accuracy: Math.round((scores.correct / Math.max(1, scores.total)) * 100),
        attempts: scores.total
      }))
      .sort((a, b) => a.accuracy - b.accuracy);
  }

  static getUserStats(userId) {
    const store = getStore();
    const userProgress = store.progress?.filter(p => p.userId === userId) || [];
    const quizAttempts = store.quizAttempts?.filter(q => q.userId === userId) || [];
    const certificates = store.certificates?.filter(c => c.userId === userId) || [];
    const userActivities = store.analytics?.filter(a => a.userId === userId) || [];

    const scoredQuizzes = quizAttempts.filter(q => q.score !== null && q.score !== undefined);
    const averageScore = scoredQuizzes.length > 0
      ? Math.round(scoredQuizzes.reduce((sum, q) => sum + q.score, 0) / scoredQuizzes.length)
      : 0;

    return {
      totalLanguages: userProgress.length,
      completedModules: userProgress.reduce((sum, p) => sum + (p.completedModuleIds?.length || 0), 0),
      quizzesTaken: quizAttempts.length,
      averageScore,
      certificatesEarned: certificates.length,
      streak: this.calculateStreak(userId),
      totalHours: Math.max(1, Math.round(userActivities.length * 0.25)),
      lastActive: this.getLastActive(userId)
    };
  }

  static calculateStreak(userId) {
    if (!userId) return 0;
    const store = getStore();
    const analytics = store.analytics || [];
    const quizAttempts = store.quizAttempts || [];
    const certificates = store.certificates || [];
    const progressList = store.progress || [];

    const dateStrings = new Set();

    analytics
      .filter(a => a.userId === userId && a.date)
      .forEach(a => dateStrings.add(a.date.slice(0, 10)));

    quizAttempts
      .filter(q => q.userId === userId && (q.submittedAt || q.generatedAt))
      .forEach(q => dateStrings.add((q.submittedAt || q.generatedAt).slice(0, 10)));

    certificates
      .filter(c => c.userId === userId && c.issuedAt)
      .forEach(c => dateStrings.add(c.issuedAt.slice(0, 10)));

    progressList
      .filter(p => p.userId === userId && p.createdAt)
      .forEach(p => dateStrings.add(p.createdAt.slice(0, 10)));

    if (dateStrings.size === 0) return 1; // Default active 1 day on signup/login

    const sortedDates = Array.from(dateStrings).sort().reverse();
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    let streak = 0;
    let expectedDate;

    if (sortedDates.includes(today)) {
      expectedDate = new Date();
    } else if (sortedDates.includes(yesterday)) {
      expectedDate = new Date(Date.now() - 86400000);
    } else {
      return 0;
    }

    while (true) {
      const dateStr = expectedDate.toISOString().slice(0, 10);
      if (sortedDates.includes(dateStr)) {
        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break;
      }
    }

    return Math.max(1, streak);
  }

  static getLastActive(userId) {
    const store = getStore();
    const timestamps = [];

    (store.analytics || [])
      .filter(a => a.userId === userId && a.date)
      .forEach(a => timestamps.push(new Date(a.date).getTime()));

    (store.quizAttempts || [])
      .filter(q => q.userId === userId && (q.submittedAt || q.generatedAt))
      .forEach(q => timestamps.push(new Date(q.submittedAt || q.generatedAt).getTime()));

    (store.certificates || [])
      .filter(c => c.userId === userId && c.issuedAt)
      .forEach(c => timestamps.push(new Date(c.issuedAt).getTime()));

    if (timestamps.length === 0) return new Date().toISOString();
    return new Date(Math.max(...timestamps)).toISOString();
  }
}

module.exports = AnalyticsService;
