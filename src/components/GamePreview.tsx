import React from 'react';
import { Eye, Download, RotateCcw, Code, Image, Users, Gamepad2 } from 'lucide-react';

interface GamePreviewProps {
  gameData: any;
  files: Record<string, string>;
  onDownload: () => void;
  onRegenerate: (component: string) => void;
  isRegenerating: boolean;
}

export const GamePreview: React.FC<GamePreviewProps> = ({
  gameData,
  files,
  onDownload,
  onRegenerate,
  isRegenerating
}) => {
  const [activeTab, setActiveTab] = React.useState<'preview' | 'code' | 'data'>('preview');
  const [previewError, setPreviewError] = React.useState<string | null>(null);

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
  const [iframeKey, setIframeKey] = React.useState<number>(0);

  React.useEffect(() => {
    const url = createPreviewContent();
    setPreviewUrl(null);
    setTimeout(() => {
      setPreviewUrl(url);
      setIframeKey((k: number) => k + 1);
    }, 0);
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
    { key: 'imagePrompts', label: 'Asset Prompts', icon: Image }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{gameData.gameName}</h2>
            <p className="text-gray-600 mt-1">{gameData.description}</p>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full mt-2">
              {gameData.genre}
            </span>
          </div>
          <button
            onClick={onDownload}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={20} />
            Download Game
          </button>
        </div>
        
        <div className="flex space-x-1 px-6">
          {['preview', 'code', 'data'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'preview' | 'code' | 'data')}
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
                  key={iframeKey}
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
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                          HP: {char.stats.health} | ATK: {char.stats.attack} | DEF: {char.stats.defense}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <h3 className="font-semibold text-gray-900">Items</h3>
                <div className="space-y-2">
                  {(gameData.items || []).map((item: any, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-gray-600 capitalize">{item.type}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                      {item.effect && (
                        <div className="text-xs text-blue-600 mt-1">{item.effect}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};