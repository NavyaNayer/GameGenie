import React, { useState, useEffect } from 'react';
import { 
  Code, 
  Layers, 
  Users, 
  BarChart3, 
  Download, 
  MessageSquare, 
  HelpCircle, 
  Shield,
  Wand2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Image,
  Music,
  Volume2,
  X,
  Gamepad2
} from 'lucide-react';
import { FeatureModal } from './FeatureModal';
import { AssetGenerator } from './AssetGenerator';
import { AIAssetService } from '../services/aiAssetService';
import { API_CONFIG } from '../config/apiKeys';

interface SidebarProps {
  gameData?: any;
  files?: Record<string, string>;
  onUpdate?: (data: any) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ gameData, files, onUpdate }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [showAssetGenerator, setShowAssetGenerator] = useState(false);
  type AssetType = 'images' | 'sounds' | 'music';
  const [myAssets, setMyAssets] = useState<{ images: string[]; sounds: string[]; music: string[] }>({
    images: [],
    sounds: [],
    music: []
  });
  const [showMyAssets, setShowMyAssets] = useState(false);
  const [apiStatus, setApiStatus] = useState({
    huggingFace: false,
    replicate: false,
    supabase: false
  });
  const [assets, setAssets] = useState<{ images: string[]; sounds: string[]; music: string[] }>({
    images: [],
    sounds: [],
    music: []
  });
  // Add state for Sample Games modal
  const [showSampleGames, setShowSampleGames] = useState(false);

  // Check API status on component mount
  useEffect(() => {
    const checkApiStatus = async () => {
      const huggingFaceReady = API_CONFIG.HUGGING_FACE.apiKey !== 'hf_YOUR_TOKEN_HERE';
      const replicateReady = await AIAssetService.testReplicateKey();
      const supabaseReady = API_CONFIG.SUPABASE.url !== 'YOUR_SUPABASE_URL' && 
                           API_CONFIG.SUPABASE.anonKey !== 'YOUR_SUPABASE_ANON_KEY';

      setApiStatus({
        huggingFace: huggingFaceReady,
        replicate: replicateReady,
        supabase: supabaseReady
      });
    };

    checkApiStatus();
  }, []);

  const features = [
    {
      id: 'asset-generator',
      name: 'AI Asset Generator',
      description: 'Generate images, sounds, and music',
      icon: Wand2,
      color: 'bg-purple-500',
      category: 'Creation'
    },
    {
      id: 'code-assistant',
      name: 'AI Prototype Code Assistant',
      description: 'Get AI-powered code suggestions for prototypes',
      icon: Code,
      color: 'bg-blue-500',
      category: 'Prototyping'
    },
    {
      id: 'procedural',
      name: 'Procedural Content',
      description: 'Generate levels and maps',
      icon: Layers,
      color: 'bg-green-500',
      category: 'Creation'
    },
    {
      id: 'npc-dialogue',
      name: 'AI NPC Dialogue',
      description: 'Generate character conversations',
      icon: MessageSquare,
      color: 'bg-pink-500',
      category: 'Content'
    },
    {
      id: 'tutorials',
      name: 'AI Tutorials',
      description: 'Get contextual help and guides',
      icon: HelpCircle,
      color: 'bg-cyan-500',
      category: 'Help'
    },
    {
      id: 'analytics',
      name: 'Prototype Analytics',
      description: 'Track player behavior',
      icon: BarChart3,
      color: 'bg-orange-500',
      category: 'Analysis'
    },
    {
      id: 'collaboration',
      name: 'Collaboration',
      description: 'Work together in real-time',
      icon: Users,
      color: 'bg-purple-500',
      category: 'Sharing'
    },
    {
      id: 'accessibility',
      name: 'Accessibility Checker',
      description: 'Improve prototype accessibility',
      icon: Shield,
      color: 'bg-red-500',
      category: 'Quality'
    },
    {
      id: 'export',
      name: 'Export & Share',
      description: 'Package and share prototypes',
      icon: Download,
      color: 'bg-indigo-500',
      category: 'Sharing'
    }
  ];

  const categories = ['Creation', 'Prototyping', 'Content', 'Analysis', 'Quality', 'Help', 'Sharing'];

  const handleFeatureClick = (featureId: string) => {
    if (featureId === 'asset-generator') {
      setShowAssetGenerator(true);
    } else {
      setActiveFeature(featureId);
    }
  };

  const getFeaturesByCategory = (category: string) => {
    return features.filter(feature => feature.category === category);
  };

  const getStatusIcon = (isReady: boolean) => {
    return isReady ? '✅ Ready' : '⚠️ Setup';
  };

  const getStatusColor = (isReady: boolean) => {
    return isReady ? 'text-green-600' : 'text-orange-600';
  };

  const handleSaveAsset = (asset: { type: AssetType; url: string; index: number }) => {
    setMyAssets(prev => {
      if (prev[asset.type].includes(asset.url)) {
        return prev; // Prevent duplicates
      }
      return {
        ...prev,
        [asset.type]: [...prev[asset.type], asset.url]
      };
    });
  };

  // Main screen feature rendering
  let mainFeatureScreen = null;
  if (activeFeature) {
    mainFeatureScreen = (
      <FeatureModal
        feature={activeFeature}
        gameData={gameData || {}}
        files={files || {}}
        onClose={() => setActiveFeature(null)}
        onUpdate={onUpdate}
      />
    );
  }
  if (showAssetGenerator) {
    mainFeatureScreen = (
      <AssetGenerator
        gameData={gameData || { gameName: 'New Game', genre: 'Adventure', theme: 'Fantasy' }}
        onClose={() => setShowAssetGenerator(false)}
        onAssetsUpdate={setAssets}
        onSaveAsset={handleSaveAsset}
      />
    );
  }

  return (
    <>
      <div className={`fixed left-0 top-0 h-full bg-white shadow-2xl border-r border-gray-200 transition-all duration-300 z-40 ${
        isCollapsed ? 'w-16' : 'w-80'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Sparkles className="text-purple-600" size={24} />
              <h2 className="text-lg font-bold text-gray-900">AI Features</h2>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Content */}
        <div className="h-full overflow-y-auto pb-20">
          {!isCollapsed ? (
            <div className="p-4 space-y-6">
              {/* Quick Actions */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Quick Actions</h3>
                <div className="grid grid-cols-6 gap-2">
                  <button
                    onClick={() => setShowAssetGenerator(true)}
                    className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group col-span-3"
                  >
                    <Image className="text-purple-600 mx-auto mb-1 group-hover:scale-110 transition-transform" size={20} />
                    <div className="text-xs text-purple-700 font-medium">Images</div>
                  </button>
                  <button
                    onClick={() => setShowAssetGenerator(true)}
                    className="p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group col-span-3"
                  >
                    <Music className="text-green-600 mx-auto mb-1 group-hover:scale-110 transition-transform" size={20} />
                    <div className="text-xs text-green-700 font-medium">Sounds</div>
                  </button>
                  <button
                    onClick={() => setShowMyAssets(true)}
                    className="p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors group col-span-3"
                  >
                    <Download className="text-yellow-600 mx-auto mb-1 group-hover:scale-110 transition-transform" size={20} />
                    <div className="text-xs text-yellow-700 font-medium">My Assets</div>
                  </button>
                  <button
                    onClick={() => setShowSampleGames(true)}
                    className="p-3 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors group col-span-3"
                  >
                    <Gamepad2 className="text-pink-600 mx-auto mb-1 group-hover:scale-110 transition-transform" size={20} />
                    <div className="text-xs text-pink-700 font-medium">Sample Games</div>
                  </button>
                </div>
              </div>

              {/* Features by Category */}
              {categories.map(category => {
                const categoryFeatures = getFeaturesByCategory(category);
                if (categoryFeatures.length === 0) return null;

                return (
                  <div key={category} className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{category}</h3>
                    <div className="space-y-2">
                      {categoryFeatures.map(feature => {
                        const Icon = feature.icon;
                        // Add a note below the Procedural Content button
                        const isProcedural = feature.id === 'procedural';
                        return (
                          <div key={feature.id}>
                            <button
                              onClick={() => handleFeatureClick(feature.id)}
                              className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 ${feature.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                  <Icon className="text-white" size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-gray-900 text-sm truncate">{feature.name}</div>
                                  <div className="text-xs text-gray-600 leading-relaxed">{feature.description}</div>
                                </div>
                              </div>
                            </button>
                            
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

            </div>
          ) : (
            // Collapsed view
            <div className="p-2 space-y-2">
              {features.map(feature => {
                const Icon = feature.icon;
                return (
                  <button
                    key={feature.id}
                    onClick={() => handleFeatureClick(feature.id)}
                    className="w-full p-3 rounded-lg hover:bg-gray-100 transition-colors group relative"
                    title={feature.name}
                  >
                    <div className={`w-8 h-8 ${feature.color} rounded-lg flex items-center justify-center mx-auto group-hover:scale-110 transition-transform`}>
                      <Icon className="text-white" size={16} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {/* Render main feature screen instead of modal */}
      {mainFeatureScreen}

      {/* My Assets Modal/Tab */}
      {showMyAssets && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-auto p-6 relative">
            <button
              onClick={() => setShowMyAssets(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              <Download className="text-yellow-600" size={24} /> My Assets
            </h2>
            {(['images', 'sounds', 'music'] as AssetType[]).map(type => (
              <div key={type} className="mb-8">
                <h3 className="text-lg font-semibold mb-3 capitalize">{type}</h3>
                {myAssets[type].length === 0 ? (
                  <div className="text-gray-400 text-sm mb-4">No saved {type} yet.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myAssets[type].map((url: string, idx: number) => (
                      <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center">
                        {type === 'images' ? (
                          <img src={url} alt={`Saved ${type} ${idx + 1}`} className="w-full h-40 object-cover mb-2" />
                        ) : (
                          <audio controls src={url} className="w-full mb-2" />
                        )}
                        <span className="text-xs text-gray-700">{type.slice(0, -1)} {idx + 1}</span>
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `my-asset-${type}-${idx + 1}.${type === 'images' ? 'png' : 'wav'}`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="mt-2 flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Download size={14} />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sample Games Modal */}
      {showSampleGames && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-auto p-6 relative">
            <button
              onClick={() => setShowSampleGames(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              <Gamepad2 className="text-pink-600" size={24} /> Sample Games
            </h2>
            <ul className="space-y-4">
              <li>
                <a
                  href="/samples/breakout.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold transition-colors"
                >
                  Breakout
                </a>
              </li>
              <li>
                <a
                  href="/samples/memory.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 font-semibold transition-colors"
                >
                  Memory
                </a>
              </li>
              <li>
                <a
                  href="/samples/racing.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3 rounded-lg bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-semibold transition-colors"
                >
                  Racing
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};