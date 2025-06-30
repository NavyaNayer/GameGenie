import React, { useState } from 'react';
import { AICodeAssistant } from '../services/aiCodeAssistant';

interface GameConfigProps {
  config: any;
  onChange: (newConfig: any) => void;
}

export const GameConfig: React.FC<GameConfigProps> = ({ config, onChange }) => {
  const [loading, setLoading] = useState(false);

  // Helper to call Together AI and update config
  const updateConfigWithAI = async (newConfig: any, changedKey: string) => {
    setLoading(true);
    try {
      // Compose a prompt for Together AI
      const prompt = `Update the game prototype code and data for the following configuration change: ${changedKey} set to ${newConfig[changedKey]}.\nCurrent config: ${JSON.stringify(newConfig)}`;
      // Use the current game code as context if available
      const code = config.gameCode || '';
      const aiResult = await AICodeAssistant.analyzeCode(code, prompt);
      // If AI returns code, update config and gameCode
      if (aiResult) {
        onChange({ ...newConfig, gameCode: aiResult });
      } else {
        onChange(newConfig);
      }
    } catch (e) {
      onChange(newConfig);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold mb-4">Game Config</h2>
      <div>
        <label className="block text-sm font-medium mb-2">Difficulty</label>
        <input
          type="range"
          min={1}
          max={3}
          value={config.difficulty === 'easy' ? 1 : config.difficulty === 'medium' ? 2 : 3}
          onChange={e => {
            const val = Number(e.target.value);
            const newConfig = { ...config, difficulty: val === 1 ? 'easy' : val === 2 ? 'medium' : 'hard' };
            updateConfigWithAI(newConfig, 'difficulty');
          }}
          className="w-full"
          disabled={loading}
        />
        <div className="flex justify-between text-xs mt-1">
          <span>Easy</span>
          <span>Medium</span>
          <span>Hard</span>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Sound</label>
        <input
          type="checkbox"
          checked={!!config.sound}
          onChange={e => {
            const newConfig = { ...config, sound: e.target.checked };
            updateConfigWithAI(newConfig, 'sound');
          }}
          className="mr-2"
          disabled={loading}
        />
        <span>{config.sound ? 'On' : 'Off'}</span>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Graphics Quality</label>
        <select
          value={config.graphics || 'medium'}
          onChange={e => {
            const newConfig = { ...config, graphics: e.target.value };
            updateConfigWithAI(newConfig, 'graphics');
          }}
          className="w-full border rounded px-2 py-1"
          disabled={loading}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Player Name</label>
        <input
          type="text"
          value={config.playerName || ''}
          onChange={e => {
            const newConfig = { ...config, playerName: e.target.value };
            updateConfigWithAI(newConfig, 'playerName');
          }}
          className="w-full border rounded px-2 py-1"
          disabled={loading}
        />
      </div>
      {loading && <div className="text-blue-600 text-sm">Updating game with Together AI...</div>}
    </div>
  );
};
