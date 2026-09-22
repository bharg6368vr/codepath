import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import ChatWidget from './components/ChatWidget'

// Existing Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Languages from './pages/Languages'
import CourseTrack from './pages/CourseTrack'
import Workspace from './pages/Workspace'
import Quiz from './pages/Quiz'
import Certificate from './pages/Certificate'
import Verify from './pages/Verify'
import NotFound from './pages/NotFound'

import WelcomeFlow from './components/WelcomeFlow'
import Dashboard from './pages/Dashboard'
import Leaderboard from './pages/Leaderboard'
import Arcade from './pages/Arcade'
import VideoHub from './pages/VideoHub'

import IntroVideoSplash from './components/IntroVideoSplash'

export default function App() {
  return (
    <>
      <IntroVideoSplash />
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/workspace" element={<Workspace />} />
            <Route path="/verify/:certificateId" element={<Verify />} />
            <Route path="/arcade" element={<Arcade />} />
            <Route path="/videos" element={<VideoHub />} />

            {/* New Feature Routes */}
            <Route path="/welcome" element={<WelcomeFlow />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<Leaderboard />} />

            {/* Standard Protected Routes */}
            <Route path="/languages" element={<ProtectedRoute><Languages /></ProtectedRoute>} />
            <Route path="/course/:languageId" element={<ProtectedRoute><CourseTrack /></ProtectedRoute>} />
            <Route path="/quiz/:languageId" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
            <Route path="/certificate/:languageId" element={<ProtectedRoute><Certificate /></ProtectedRoute>} />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <ChatWidget />
      </div>
    </>
  )
}