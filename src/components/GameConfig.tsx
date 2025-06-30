import React from 'react';

interface GameConfigProps {
  config: any;
  onChange: (newConfig: any) => void;
}

export const GameConfig: React.FC<GameConfigProps> = ({ config, onChange }) => {
  // Example: slider for difficulty, toggles for features, etc.
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
            onChange({ ...config, difficulty: val === 1 ? 'easy' : val === 2 ? 'medium' : 'hard' });
          }}
          className="w-full"
        />
        <div className="flex justify-between text-xs mt-1">
          <span>Easy</span>
          <span>Medium</span>
          <span>Hard</span>
        </div>
      </div>
      {/* Add more config sliders/toggles as needed */}
    </div>
  );
};
