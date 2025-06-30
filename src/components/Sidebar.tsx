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
  Volume2
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
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setShowAssetGenerator(true)}
                    className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
                  >
                    <Image className="text-purple-600 mx-auto mb-1 group-hover:scale-110 transition-transform" size={20} />
                    <div className="text-xs text-purple-700 font-medium">Images</div>
                  </button>
                  <button
                    onClick={() => setShowAssetGenerator(true)}
                    className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                  >
                    <Volume2 className="text-blue-600 mx-auto mb-1 group-hover:scale-110 transition-transform" size={20} />
                    <div className="text-xs text-blue-700 font-medium">Sounds</div>
                  </button>
                  <button
                    onClick={() => setShowAssetGenerator(true)}
                    className="p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
                  >
                    <Music className="text-green-600 mx-auto mb-1 group-hover:scale-110 transition-transform" size={20} />
                    <div className="text-xs text-green-700 font-medium">Music</div>
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
                        return (
                          <button
                            key={feature.id}
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
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* API Status */}
              <div className="mt-6 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">🔧 API Status</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span>Hugging Face</span>
                    <span className={getStatusColor(apiStatus.huggingFace)}>
                      {getStatusIcon(apiStatus.huggingFace)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Replicate</span>
                    <span className={getStatusColor(apiStatus.replicate)}>
                      {getStatusIcon(apiStatus.replicate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Supabase</span>
                    <span className={getStatusColor(apiStatus.supabase)}>
                      {getStatusIcon(apiStatus.supabase)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {apiStatus.replicate 
                    ? "🎵 Sound & Music generation ready!" 
                    : "⚠️ Check your Replicate API key configuration"
                  }
                </p>
              </div>

              {/* Debug Info */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">🔍 Debug Info</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Replicate Key: {API_CONFIG.REPLICATE.apiKey.substring(0, 10)}...</div>
                  <div>Endpoint: {API_CONFIG.REPLICATE.endpoint}</div>
                </div>
              </div>
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
    </>
  );
};