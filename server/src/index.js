require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { collection } = require('./db/store');
const { run: seedContent } = require('./seed/runSeed');
const authRoutes = require('./routes/auth');
const languageRoutes = require('./routes/languages');
const progressRoutes = require('./routes/progress');
const quizRoutes = require('./routes/quiz');
const certificateRoutes = require('./routes/certificate');
const compilerRoutes = require('./routes/compiler');
const chatRoutes = require('./routes/chat');
const dashboardRoutes = require('./routes/dashboard');
const leaderboardRoutes = require('./routes/leaderboard');
const bookmarksRoutes = require('./routes/bookmarks');
const notesRoutes = require('./routes/notes');
const onboardingRoutes = require('./routes/onboarding');
const codeReviewRoutes = require('./routes/codeReview');
const arcadeRoutes = require('./routes/arcade');

const app = express();
const PORT = process.env.PORT || 4000;

process.env.PATH = `${process.env.PATH};${process.env.ProgramFiles}\\Microsoft\\jdk-21.0.12.8-hotspot\\bin;${process.env.LOCALAPPDATA}\\Microsoft\\WinGet\\Packages\\BrechtSanders.WinLibs.MCF.UCRT_Microsoft.Winget.Source_8wekyb3d8bbwe\\mingw64\\bin`;

const languages = collection('languages');
const modules = collection('modules');

if (languages.all().length === 0 && modules.all().length === 0) {
  seedContent();
}

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/languages', languageRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/certificate', certificateRoutes);
app.use('/api/compiler', compilerRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/bookmarks', bookmarksRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/code-review', codeReviewRoutes);
app.use('/api/arcade', arcadeRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`CodePath server listening on http://localhost:${PORT}`);
});