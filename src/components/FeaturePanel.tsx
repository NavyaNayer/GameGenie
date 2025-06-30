import React, { useState } from 'react';
import { 
  Code, 
  Layers, 
  Users, 
  BarChart3, 
  Download, 
  MessageSquare, 
  HelpCircle, 
  Shield,
  Wand2
} from 'lucide-react';
import { FeatureModal } from './FeatureModal';

interface FeaturePanelProps {
  gameData: any;
  files: Record<string, string>;
  onUpdate?: (data: any) => void;
}

export const FeaturePanel: React.FC<FeaturePanelProps> = ({ gameData, files, onUpdate }) => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const features = [
    {
      id: 'code-assistant',
      name: 'AI Code Assistant',
      description: 'Get AI-powered code suggestions and fixes',
      icon: Code,
      color: 'bg-blue-500'
    },
    {
      id: 'procedural',
      name: 'Procedural Content',
      description: 'Generate levels, maps, and content algorithmically',
      icon: Layers,
      color: 'bg-green-500'
    },
    {
      id: 'collaboration',
      name: 'Real-time Collaboration',
      description: 'Work together with others in real-time',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      id: 'analytics',
      name: 'Analytics & Playtest',
      description: 'Track player behavior and game performance',
      icon: BarChart3,
      color: 'bg-orange-500'
    },
    {
      id: 'export',
      name: 'Export & Sharing',
      description: 'Package and share your games',
      icon: Download,
      color: 'bg-indigo-500'
    },
    {
      id: 'npc-dialogue',
      name: 'AI NPC Dialogue',
      description: 'Generate dynamic character conversations',
      icon: MessageSquare,
      color: 'bg-pink-500'
    },
    {
      id: 'tutorials',
      name: 'AI Tutorials & Help',
      description: 'Get contextual help and tutorials',
      icon: HelpCircle,
      color: 'bg-cyan-500'
    },
    {
      id: 'accessibility',
      name: 'Accessibility Checker',
      description: 'Analyze and improve game accessibility',
      icon: Shield,
      color: 'bg-red-500'
    }
  ];

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
        <div className="flex items-center gap-3 mb-6">
          <Wand2 className="text-purple-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-900">AI-Powered Features</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group text-left"
              >
                <div className={`w-10 h-10 ${feature.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="text-white" size={20} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-2">🚀 Getting Started</h3>
          <p className="text-sm text-gray-700 mb-3">
            To use all features, you'll need to configure API keys in <code className="bg-white px-1 rounded">src/config/apiKeys.ts</code>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <strong>Free APIs needed:</strong>
              <ul className="mt-1 space-y-1 text-gray-600">
                <li>• Hugging Face (Image generation)</li>
                <li>• Replicate (Sound/Music generation)</li>
              </ul>
            </div>
            <div>
              <strong>Optional (for full features):</strong>
              <ul className="mt-1 space-y-1 text-gray-600">
                <li>• Supabase (Collaboration & Analytics)</li>
                <li>• OpenAI (Enhanced AI assistance)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {activeFeature && (
        <FeatureModal
          feature={activeFeature}
          gameData={gameData}
          files={files}
          onClose={() => setActiveFeature(null)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};