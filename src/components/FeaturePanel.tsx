import React from 'react';

interface FeaturePanelProps {
  gameData: any;
  files: Record<string, string>;
  onUpdate: (data: any) => void;
}

export const FeaturePanel: React.FC<FeaturePanelProps> = ({ gameData, files, onUpdate }) => {
  // Example: Display game data and allow updates
  return (
    <div className="bg-white rounded-lg shadow p-6 mt-8">
      <h2 className="text-xl font-bold mb-4">Feature Panel</h2>
      {gameData?.gameName && (
        <div className="mb-2">
          <span className="font-semibold text-lg text-indigo-700">{gameData.gameName}</span>
        </div>
      )}
      {gameData?.description && (
        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
          <h3 className="font-semibold text-blue-700 mb-1">Prototype Idea</h3>
          <p className="text-blue-900">{gameData.description}</p>
        </div>
      )}
      {gameData?.usedFallback && gameData?.rawLlamaOutput && (
        <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <h3 className="font-semibold text-yellow-700 mb-1">Raw Llama Output (Console Output)</h3>
          <pre className="text-yellow-900 text-xs whitespace-pre-wrap overflow-x-auto">{gameData.rawLlamaOutput}</pre>
        </div>
      )}
      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mb-4">
        {JSON.stringify(gameData, null, 2)}
      </pre>
      {/* Add feature controls here as needed */}
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => onUpdate({ ...gameData, updated: true })}
      >
        Example Update
      </button>
    </div>
  );
};
