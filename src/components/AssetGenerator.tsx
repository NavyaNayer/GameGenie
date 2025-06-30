import React, { useState } from 'react';
import { X, Wand2, Download, Loader2, Image, Music, Volume2 } from 'lucide-react';
import { AIAssetService } from '../services/aiAssetService';
import toast from 'react-hot-toast';

interface AssetGeneratorProps {
  gameData: any;
  onClose: () => void;
  onAssetsUpdate?: (assets: { images: string[]; sounds: string[]; music: string[] }) => void;
  onSaveAsset?: (asset: { type: string; url: string; index: number }) => void;
}

export const AssetGenerator: React.FC<AssetGeneratorProps> = ({ gameData, onClose, onAssetsUpdate, onSaveAsset }) => {
  const [activeTab, setActiveTab] = useState<'images' | 'sounds' | 'music'>('images');
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [loading, setLoading] = useState(false);
  const [generatedAssets, setGeneratedAssets] = useState<{
    images: string[];
    sounds: string[];
    music: string[];
  }>({
    images: [],
    sounds: [],
    music: []
  });

  // Call onAssetsUpdate whenever generatedAssets changes
  React.useEffect(() => {
    if (onAssetsUpdate) {
      onAssetsUpdate(generatedAssets);
    }
  }, [generatedAssets, onAssetsUpdate]);

  const generateAsset = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);
    try {
      let result = '';
      const contextualPrompt = `${prompt} for ${gameData.gameName}, a ${gameData.genre} game with ${gameData.theme} theme`;

      // Use only the raw prompt for Freesound search (not contextual)
      switch (activeTab) {
        case 'images':
          result = await AIAssetService.generateImageWithOpenAI(contextualPrompt);
          setGeneratedAssets(prev => ({
            ...prev,
            images: [...prev.images, result]
          }));
          toast.success('Image generated successfully!');
          break;
        case 'sounds':
          result = await AIAssetService.generateSound(prompt); // Use only the raw prompt
          setGeneratedAssets(prev => ({
            ...prev,
            sounds: [...prev.sounds, result]
          }));
          toast.success('Sound generated successfully!');
          break;
        case 'music':
          result = await AIAssetService.generateMusic(contextualPrompt, 30);
          setGeneratedAssets(prev => ({
            ...prev,
            music: [...prev.music, result]
          }));
          toast.success('Music generated successfully!');
          break;
      }
    } catch (error) {
      console.error('Asset generation failed:', error);
      toast.error(`Failed to generate ${activeTab.slice(0, -1)}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadAsset = (url: string, type: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${gameData.gameName}-${type}-${index + 1}.${type === 'images' ? 'png' : 'wav'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${type.slice(0, -1)} downloaded!`);
  };

  const getPlaceholderPrompts = () => {
    const prompts = {
      images: [
        `Main character sprite for ${gameData.genre} game`,
        `Background environment - ${gameData.theme} style`,
        `Enemy creature design`,
        `Power-up item icon`,
        `Game UI elements and buttons`
      ],
      sounds: [
        'Jump sound effect',
        'Coin collection sound',
        'Enemy defeat sound',
        'Power-up activation sound',
        'Game over sound'
      ],
      music: [
        `Background music for ${gameData.theme} ${gameData.genre} game`,
        'Victory fanfare',
        'Menu screen music',
        'Boss battle theme',
        'Ambient exploration music'
      ]
    };
    return prompts[activeTab];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Wand2 className="text-purple-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">AI Asset Generator</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex border-b border-gray-200">
          {[
            { key: 'images', label: 'Images', icon: Image },
            { key: 'sounds', label: 'Sounds', icon: Volume2 },
            { key: 'music', label: 'Music', icon: Music }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center gap-2 px-6 py-4 transition-colors ${
                activeTab === key
                  ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Generation Form */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Generate New {activeTab.slice(0, -1)}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prompt
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={`Describe the ${activeTab.slice(0, -1)} you want to generate...`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                {activeTab === 'images' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Style
                    </label>
                    <select
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="realistic">Realistic</option>
                      <option value="cartoon">Cartoon</option>
                      <option value="pixel art">Pixel Art</option>
                      <option value="anime">Anime</option>
                      <option value="fantasy">Fantasy</option>
                      <option value="sci-fi">Sci-Fi</option>
                    </select>
                  </div>
                )}

                <button
                  onClick={generateAsset}
                  disabled={loading || !prompt.trim()}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 size={20} />
                      Generate {activeTab.slice(0, -1)}
                    </>
                  )}
                </button>
              </div>

              {/* Quick Prompts */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Prompts:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {getPlaceholderPrompts().map((placeholderPrompt, index) => (
                    <button
                      key={index}
                      onClick={() => setPrompt(placeholderPrompt)}
                      className="text-left p-2 text-sm bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                    >
                      {placeholderPrompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generated Assets */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Generated {activeTab}</h3>
              
              {generatedAssets[activeTab].length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">
                    {activeTab === 'images' ? '🖼️' : activeTab === 'sounds' ? '🔊' : '🎵'}
                  </div>
                  <p>No {activeTab} generated yet</p>
                  <p className="text-sm">Use the form above to generate your first {activeTab.slice(0, -1)}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {generatedAssets[activeTab].map((asset, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      {activeTab === 'images' ? (
                        <img
                          src={asset}
                          alt={`Generated ${activeTab.slice(0, -1)} ${index + 1}`}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="h-48 flex items-center justify-center bg-gray-100">
                          <div className="text-center">
                            <div className="text-4xl mb-2">
                              {activeTab === 'sounds' ? '🔊' : '🎵'}
                            </div>
                            <audio controls className="mb-2">
                              <source src={asset} type="audio/wav" />
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-gray-700">
                            {activeTab.slice(0, -1)} {index + 1}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => downloadAsset(asset, activeTab, index)}
                              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Download size={14} />
                              Download
                            </button>
                            {onSaveAsset && (
                              <button
                                onClick={() => {
                                  onSaveAsset({ type: activeTab as 'images' | 'sounds' | 'music', url: asset, index });
                                  toast.success('Asset saved to My Assets!');
                                }}
                                className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                              >
                                Save
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="text-sm text-gray-600 text-center">
            <p>💡 <strong>Tip:</strong> Configure your API keys in <code>src/config/apiKeys.ts</code> for full functionality</p>
            <p className="mt-1">Using <strong>OpenAI</strong> for images, Replicate for sounds/music</p>
          </div>
        </div>
      </div>
    </div>
  );
};