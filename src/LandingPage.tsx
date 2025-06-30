import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Wand2, Gamepad2 } from 'lucide-react';

const features = [
  'Instant AI-powered game prototyping',
  'No coding required – just describe your idea',
  'Download, play, and share your creations',
  'Stunning AI-generated art & sound',
  'Classic and creative genres supported',
  'Save your favorite assets',
  'Game Flow overview for every prototype',
  'Analytics and collaboration ready',
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-100 to-blue-50 flex flex-col items-center justify-center relative overflow-x-hidden">
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-200 opacity-30 rounded-full blur-3xl z-0" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-purple-200 opacity-30 rounded-full blur-3xl z-0" />
      <div className="bg-white/90 rounded-3xl shadow-2xl p-10 max-w-3xl w-full border-2 border-indigo-200 flex flex-col items-center z-10">
        <div className="flex items-center justify-center mb-6">
          <Wand2 className="text-indigo-600 mr-3 drop-shadow-lg animate-bounce" size={44} />
          <h1 className="text-5xl font-extrabold text-indigo-700 tracking-tight drop-shadow-lg">Game Genie</h1>
          <Sparkles className="text-purple-500 ml-3 drop-shadow-lg animate-pulse" size={44} />
        </div>
        <p className="text-indigo-700 text-lg leading-relaxed font-medium mb-6 text-center">
          Instantly turn your wildest game ideas into playable prototypes with the power of AI.<br/>
          Describe any game concept and let Game Genie conjure it into reality.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8 text-left text-indigo-800 font-medium w-full max-w-2xl">
          {features.map(f => (
            <li key={f} className="flex items-center"><span className="mr-2 text-indigo-400">★</span>{f}</li>
          ))}
        </ul>
        <button
          className="mt-4 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-500 text-white text-lg font-bold rounded-xl shadow-lg hover:scale-105 hover:from-indigo-700 hover:to-purple-600 transition-all duration-200"
          onClick={() => navigate('/generate')}
        >
          Start Generating Games
        </button>
        <div className="mt-10 w-full flex flex-col items-center">
          <h2 className="text-xl font-bold text-indigo-700 mb-2 flex items-center justify-center">
            <Gamepad2 className="mr-2 text-indigo-500" size={22} /> Sample Games
          </h2>
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            <a href="/samples/snake.html" target="_blank" rel="noopener" className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2 text-indigo-700 font-semibold shadow hover:bg-indigo-100 transition">Snake</a>
            <a href="/samples/breakout.html" target="_blank" rel="noopener" className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2 text-indigo-700 font-semibold shadow hover:bg-indigo-100 transition">Breakout</a>
            <a href="/samples/tictactoe.html" target="_blank" rel="noopener" className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2 text-indigo-700 font-semibold shadow hover:bg-indigo-100 transition">Tic-Tac-Toe</a>
          </div>
          <div className="w-full max-w-xs bg-indigo-100/60 rounded-xl p-4 shadow text-indigo-800 text-sm">
            <b>How it works:</b>
            <ol className="list-decimal ml-5 mt-2 space-y-1">
              <li>Describe your game idea in plain English</li>
              <li>Click <span className="font-semibold text-indigo-700">Start Generating Games</span></li>
              <li>Game Genie creates a playable prototype instantly!</li>
            </ol>
          </div>
        </div>
      </div>
      <footer className="mt-12 text-center text-gray-500 text-sm z-10 w-full">
        &copy; {new Date().getFullYear()} Game Genie. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
