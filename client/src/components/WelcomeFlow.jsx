import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

export default function WelcomeFlow({ onComplete }) {
  const navigate = useNavigate();
  const [stage, setStage] = useState('greeting');
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [personality, setPersonality] = useState(null);
  const [goal, setGoal] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');

  // Initialize welcome on component mount
  useEffect(() => {
    if (stage === 'greeting') {
      const welcomeMessages = [
        {
          speaker: 'bot',
          message: 'Hey there! 👋 Welcome to CodePath!',
          delay: 0
        },
        {
          speaker: 'bot',
          message: "I'm so excited you're here to learn coding!",
          delay: 1
        },
        {
          speaker: 'bot',
          message: "What's your name?",
          delay: 2
        }
      ];
      setConversation(welcomeMessages);
    }
  }, [stage]);

  // Fetch next stage from backend
  const handleNext = async (response) => {
    if (!response?.trim()) return;
    
    setLoading(true);
    try {
      // Add user's response to conversation
      setConversation(prev => [...prev, {
        speaker: 'user',
        message: response
      }]);

      // Get next stage
      const res = await client.post('/onboarding/next-stage', {
        stage,
        response
      });

      if (res.data.stage === 'complete') {
        // Save onboarding state
        await client.post('/onboarding/save-state', {
          personality,
          goal
        }).catch(() => {});
        
        setConversation(prev => [...prev, {
          speaker: 'bot',
          message: res.data.message
        }]);
        
        setTimeout(() => {
          if (typeof onComplete === 'function') {
            onComplete({ personality, goal, userName });
          } else {
            navigate('/dashboard');
          }
        }, 1500);
      } else {
        // Update stage and show next messages
        setStage(res.data.stage);
        setUserInput('');
        
        // Add bot messages with delays
        res.data.messages.forEach((msg, idx) => {
          setTimeout(() => {
            setConversation(prev => [...prev, {
              speaker: 'bot',
              message: msg
            }]);
          }, idx * 800);
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setConversation(prev => [...prev, {
        speaker: 'bot',
        message: 'Sorry, something went wrong. Please try again!'
      }]);
    }
    setLoading(false);
  };

  const handleGreetingSubmit = () => {
    if (userInput.trim()) {
      setUserName(userInput);
      handleNext(userInput);
    }
  };

  const handlePersonalitySelect = (selected) => {
    setPersonality(selected);
    handleNext(selected);
  };

  const handleGoalSelect = (selected) => {
    setGoal(selected);
    handleNext(selected);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative overflow-hidden">
        {/* Glow Background */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-glow" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-glow" />

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20 animate-float">
            🤖
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Welcome to CodePath
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase">
                Onboarding
              </span>
            </h2>
            <p className="text-xs text-slate-400">Let's set up your personalized coding journey</p>
          </div>
        </div>

        {/* Conversation Flow */}
        <div className="space-y-3 mb-6 max-h-80 overflow-y-auto pr-1">
          {conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.speaker === 'bot' ? 'justify-start' : 'justify-end'} animate-fade-in-up`}
            >
              <div
                className={`max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.speaker === 'bot'
                    ? 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
                    : 'bg-emerald-500 text-slate-950 font-medium rounded-tr-none shadow-md shadow-emerald-500/20'
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start animate-fade-in-up">
              <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.15s]"></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.3s]"></div>
              </div>
            </div>
          )}
        </div>

        {/* Input/Options Area */}
        <div className="space-y-3 pt-2">
          {stage === 'greeting' && (
            <div className="flex gap-2">
              <input
                type="text"
                autoFocus
                placeholder="Type your name..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleGreetingSubmit();
                  }
                }}
                className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                disabled={loading}
              />
              <button
                onClick={handleGreetingSubmit}
                disabled={loading || !userInput.trim()}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-sm rounded-xl transition cursor-pointer"
              >
                Next →
              </button>
            </div>
          )}

          {stage === 'personality' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['Quick & Practical', 'Deep & Theoretical'].map(opt => (
                <button
                  key={opt}
                  onClick={() => handlePersonalitySelect(opt)}
                  disabled={loading}
                  className="p-3.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-slate-200 hover:text-white font-medium text-sm rounded-xl transition cursor-pointer disabled:opacity-40"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {stage === 'goal' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {['Career', 'Interview', 'Hobby', 'College'].map(opt => (
                <button
                  key={opt}
                  onClick={() => handleGoalSelect(opt)}
                  disabled={loading}
                  className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-slate-200 hover:text-white font-semibold text-sm rounded-xl transition cursor-pointer disabled:opacity-40"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {stage === 'motivation' && (
            <div className="text-center text-emerald-400 text-sm font-medium py-2">
              Preparing your personalized experience... 🚀
            </div>
          )}
        </div>

        {/* Progress Dots */}
        <div className="mt-6 flex justify-center gap-2">
          {['greeting', 'personality', 'goal', 'motivation'].map(s => (
            <div
              key={s}
              className={`h-1.5 w-6 rounded-full transition-all ${
                ['greeting', 'personality', 'goal', 'motivation'].indexOf(stage) >= ['greeting', 'personality', 'goal', 'motivation'].indexOf(s)
                  ? 'bg-emerald-400'
                  : 'bg-slate-800'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
