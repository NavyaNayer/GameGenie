import React from 'react';
import { Eye, Download, RotateCcw, Code, Image, Users, Gamepad2, Wand2, Music } from 'lucide-react';
import { AssetGenerator } from './AssetGenerator';
import { GameConfig } from './GameConfig';

interface GamePreviewProps {
  gameData: any;
  files: Record<string, string>;
  onDownload: () => void;
  onRegenerate: (component: string) => void;
  isRegenerating: boolean;
  onConfigChange?: (newConfig: any) => void;
}

export const GamePreview: React.FC<GamePreviewProps> = ({
  gameData,
  files,
  onDownload,
  onRegenerate,
  isRegenerating,
  onConfigChange
}) => {
  const [activeTab, setActiveTab] = React.useState('preview');
  const [previewError, setPreviewError] = React.useState<string | null>(null);
  const [showAssetGenerator, setShowAssetGenerator] = React.useState(false);

  // Add handler for config changes
  const handleConfigChange = (newConfig: any) => {
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      // Custom event for parent to listen if needed
      window.dispatchEvent(new CustomEvent('gameConfigChange', { detail: newConfig }));
    }
    if (typeof onConfigChange === 'function') {
      onConfigChange(newConfig);
    }
  };

  const createPreviewContent = React.useCallback(() => {
    try {
      if (!files['index.html']) {
        throw new Error('No HTML file found');
      }

      const htmlContent = files['index.html'];
      const blob = new Blob([htmlContent], { type: 'text/html' });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error creating preview:', error);
      setPreviewError('Failed to create game preview');
      return null;
    }
  }, [files]);

  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const url = createPreviewContent();
    setPreviewUrl(url);
    setPreviewError(null);

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [createPreviewContent]);

  const regenerateComponents = [
    { key: 'gameCode', label: 'Game Code', icon: Code },
    { key: 'characters', label: 'Characters', icon: Users },
    { key: 'levels', label: 'Levels', icon: Gamepad2 },
    { key: 'imagePrompts', label: 'Image Prompts', icon: Image },
    { key: 'soundPrompts', label: 'Sound Prompts', icon: Music }
  ];

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between p-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{gameData.gameName}</h2>
              <p className="text-gray-600 mt-1">{gameData.description}</p>
              <div className="flex gap-2 mt-2">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {gameData.genre}
                </span>
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                  {gameData.theme}
                </span>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full capitalize">
                  {gameData.difficulty}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAssetGenerator(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Wand2 size={18} />
                Generate Assets
              </button>
              <button
                onClick={onDownload}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download size={20} />
                Download Game
              </button>
            </div>
          </div>
          
          <div className="flex space-x-1 px-6">
            {['preview', 'code', 'data', 'config'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-t-lg transition-colors capitalize ${
                  activeTab === tab
                    ? 'bg-gray-100 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'preview' && (
            <div className="space-y-6">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                {previewError ? (
                  <div className="flex items-center justify-center h-full text-red-500 flex-col">
                    <Eye className="mb-2" size={24} />
                    <p>{previewError}</p>
                    <p className="text-sm text-gray-500 mt-2">Try regenerating the game code</p>
                  </div>
                ) : previewUrl ? (
                  <iframe
                    src={previewUrl}
                    className="w-full h-full border-0"
                    title="Game Preview"
                    sandbox="allow-scripts allow-same-origin"
                    onError={() => setPreviewError('Failed to load game preview')}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <Eye className="mr-2 animate-pulse" size={24} />
                    Loading game preview...
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {regenerateComponents.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => onRegenerate(key)}
                    disabled={isRegenerating}
                    className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon size={18} className="text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium text-sm">Regenerate</div>
                      <div className="text-xs text-gray-600">{label}</div>
                    </div>
                    <RotateCcw size={14} className="ml-auto text-gray-400" />
                  </button>
                ))}
              </div>

              {/* Game Controls Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Game Controls</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Movement:</span>
                    <p className="text-gray-600">{gameData.controls?.movement || 'Arrow keys'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Action:</span>
                    <p className="text-gray-600">{gameData.controls?.action || 'Spacebar'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Special:</span>
                    <p className="text-gray-600">{gameData.controls?.special || 'Mouse click'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4">
              {Object.entries(files).map(([filename, content]) => (
                <div key={filename} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                    <span className="font-mono text-sm text-gray-700">{filename}</span>
                    <span className="text-xs text-gray-500">
                      {content.length} characters
                    </span>
                  </div>
                  <pre className="p-4 text-sm bg-gray-900 text-gray-100 overflow-x-auto max-h-60">
                    <code>{content}</code>
                  </pre>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Game Rules</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{gameData.rules}</p>
                  
                  <h3 className="font-semibold text-gray-900">Mechanics</h3>
                  <ul className="space-y-1">
                    {(gameData.mechanics || []).map((mechanic: string, index: number) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="text-blue-600 mr-2">→</span>
                        {mechanic}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Characters</h3>
                  <div className="space-y-2">
                    {(gameData.characters || []).map((char: any, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-sm">{char.name}</div>
                        <div className="text-xs text-gray-600 capitalize">{char.type}</div>
                        <div className="text-xs text-gray-500 mt-1">{char.description}</div>
                        {char.stats && (
                          <div className="text-xs text-gray-400 mt-1">
                            HP: {char.stats.health} | ATK: {char.stats.attack} | DEF: {char.stats.defense} | SPD: {char.stats.speed}
                          </div>
                        )}
                        {char.abilities && char.abilities.length > 0 && (
                          <div className="text-xs text-blue-600 mt-1">
                            Abilities: {char.abilities.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="font-semibold text-gray-900">Items</h3>
                  <div className="space-y-2">
                    {(gameData.items || []).map((item: any, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sm">{item.name}</div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            item.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                            item.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                            item.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.rarity}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 capitalize">{item.type}</div>
                        <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                        {item.effect && (
                          <div className="text-xs text-green-600 mt-1">{item.effect}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Levels</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(gameData.levels || []).map((level: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium text-sm mb-2">{level.name}</div>
                      <div className="text-xs text-gray-600 mb-2">{level.description}</div>
                      <div className="text-xs text-gray-500 mb-1">
                        <strong>Environment:</strong> {level.environment}
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        <strong>Objectives:</strong> {(level.objectives || []).join(', ')}
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        <strong>Enemies:</strong> {(level.enemies || []).join(', ')}
                      </div>
                      <div className="text-xs text-gray-500">
                        <strong>Items:</strong> {(level.items || []).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="space-y-4">
              <GameConfig config={gameData} onChange={handleConfigChange} />
            </div>
          )}
        </div>
      </div>

      {showAssetGenerator && (
        <AssetGenerator
          gameData={gameData}
          onClose={() => setShowAssetGenerator(false)}
        />
      )}
    </>
  );
};