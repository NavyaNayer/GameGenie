import React, { useState } from 'react';
import { X, Loader2, CheckCircle, AlertCircle, Info, Download } from 'lucide-react';
import toast from 'react-hot-toast';

interface FeatureModalProps {
  feature: string;
  gameData: any;
  files: Record<string, string>;
  onClose: () => void;
  onUpdate?: (data: any) => void;
}

export const FeatureModal: React.FC<FeatureModalProps> = ({
  feature,
  gameData,
  files,
  onClose,
  onUpdate
}) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [input, setInput] = useState('');

  const handleFeatureAction = async () => {
    setLoading(true);
    try {
      switch (feature) {
        case 'code-assistant':
          await handleCodeAssistant();
          break;
        case 'procedural':
          await handleProceduralGeneration();
          break;
        case 'collaboration':
          await handleCollaboration();
          break;
        case 'analytics':
          await handleAnalytics();
          break;
        case 'npc-dialogue':
          await handleNPCDialogue();
          break;
        case 'tutorials':
          await handleTutorials();
          break;
        case 'accessibility':
          await handleAccessibilityCheck();
          break;
        case 'export':
          await handleExport();
          break;
        default:
          throw new Error('Unknown feature');
      }
    } catch (error) {
      toast.error(`Failed to execute ${feature}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeAssistant = async () => {
    const { AICodeAssistant } = await import('../services/aiCodeAssistant');
    const analysis = await AICodeAssistant.analyzeCode(files['game.js'] || '', input);
    setResult({ type: 'analysis', content: analysis });
    toast.success('Code analysis completed!');
  };

  const handleProceduralGeneration = async () => {
    const { ProceduralGenerator } = await import('../services/proceduralGenerator');
    const params = {
      width: 50,
      height: 30,
      type: input as any || 'dungeon',
      difficulty: 0.5,
      theme: gameData.theme || 'fantasy',
      prompt: input || ''
    };
    const level = await ProceduralGenerator.generateLevelWithPrompt(params);
    setResult({ type: 'level', content: level });
    toast.success('Level generated successfully!');
  };

  const handleCollaboration = async () => {
    const { CollaborationService } = await import('../services/collaborationService');
    try {
      const project = await CollaborationService.createProject(gameData, 'user-123');
      setResult({ type: 'project', content: project });
      toast.success('Project created for collaboration!');
    } catch (error) {
      toast.error('Collaboration requires Supabase setup');
      setResult({ type: 'error', content: 'Please configure Supabase in apiKeys.ts' });
    }
  };

  const handleAnalytics = async () => {
    const { AnalyticsService } = await import('../services/analyticsService');
    const analytics = await AnalyticsService.getGameAnalytics(gameData.gameName);
    setResult({ type: 'analytics', content: analytics });
    toast.success('Analytics data loaded!');
  };

  const handleNPCDialogue = async () => {
    const { AICodeAssistant } = await import('../services/aiCodeAssistant');
    const prompt = `Generate dialogue for NPCs in a ${gameData.genre} game with theme: ${gameData.theme}. Context: ${input}`;
    const dialogue = await AICodeAssistant.analyzeCode('', prompt);
    setResult({ type: 'dialogue', content: dialogue });
    toast.success('NPC dialogue generated!');
  };

  const handleTutorials = async () => {
    const { AICodeAssistant } = await import('../services/aiCodeAssistant');
    const prompt = `Create a tutorial for this game: ${gameData.gameName}. Game mechanics: ${gameData.mechanics?.join(', ')}. Focus on: ${input}`;
    const tutorial = await AICodeAssistant.analyzeCode('', prompt);
    setResult({ type: 'tutorial', content: tutorial });
    toast.success('Tutorial generated!');
  };

  const handleAccessibilityCheck = async () => {
    const { AccessibilityChecker } = await import('../services/accessibilityChecker');
    const analysis = AccessibilityChecker.analyzeGame(gameData, files);
    setResult({ type: 'accessibility', content: analysis });
    toast.success('Accessibility analysis completed!');
  };

  const handleExport = async () => {
    try {
      const { ZipDownloader } = await import('../utils/zipDownloader');
      await ZipDownloader.downloadGameFiles(gameData, files);
      setResult({ type: 'export', content: 'Game exported successfully!' });
      toast.success('Game package downloaded!');
    } catch (error) {
      toast.error('Export failed');
      setResult({ type: 'error', content: 'Failed to export game package' });
    }
  };

  const renderResult = () => {
    if (!result) return null;

    switch (result.type) {
      case 'analysis':
      case 'dialogue':
      case 'tutorial':
        return (
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="whitespace-pre-wrap text-sm">{result.content}</pre>
          </div>
        );

      case 'level':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Generated Level</h3>
            <div className="bg-gray-900 p-4 rounded-lg overflow-auto">
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${result.content.grid[0].length}, 1fr)` }}>
                {result.content.grid.flat().map((cell: number, index: number) => (
                  <div
                    key={index}
                    className={`w-2 h-2 ${
                      cell === 0 ? 'bg-gray-300' : 
                      cell === 1 ? 'bg-gray-800' : 
                      cell === 2 ? 'bg-blue-500' : 'bg-red-500'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>Legend: Gray = Floor, Dark = Wall, Blue = Water, Red = Hazard</p>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{result.content.totalSessions}</div>
                <div className="text-sm text-blue-800">Total Sessions</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{result.content.completionRate.toFixed(1)}%</div>
                <div className="text-sm text-green-800">Completion Rate</div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium mb-2">Event Counts</h4>
              {Object.entries(result.content.eventCounts).map(([event, count]) => (
                <div key={event} className="flex justify-between text-sm">
                  <span className="capitalize">{event.replace('_', ' ')}</span>
                  <span>{count as number}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'accessibility':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className={`text-2xl font-bold ${
                result.content.score >= 80 ? 'text-green-600' : 
                result.content.score >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {result.content.score}/100
              </div>
              <div className="text-sm text-gray-600">Accessibility Score</div>
            </div>
            
            <div className="space-y-2">
              {result.content.issues.map((issue: any, index: number) => (
                <div key={index} className={`flex items-start gap-2 p-2 rounded-lg ${
                  issue.type === 'error' ? 'bg-red-50' :
                  issue.type === 'warning' ? 'bg-yellow-50' : 'bg-blue-50'
                }`}>
                  {issue.type === 'error' ? <AlertCircle className="text-red-600 mt-0.5" size={16} /> :
                   issue.type === 'warning' ? <AlertCircle className="text-yellow-600 mt-0.5" size={16} /> :
                   <Info className="text-blue-600 mt-0.5" size={16} />}
                  <div className="flex-1">
                    <div className="font-medium text-sm">{issue.message}</div>
                    <div className="text-xs text-gray-600">{issue.suggestion}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'project':
        return (
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="text-green-600" size={20} />
              <span className="font-medium">Project Created Successfully!</span>
            </div>
            <p className="text-sm text-gray-600">
              Project ID: {result.content.id}
            </p>
            <p className="text-sm text-gray-600">
              Share this project with collaborators using the project ID.
            </p>
          </div>
        );

      case 'export':
        return (
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Download className="text-green-600" size={20} />
              <span className="font-medium">Export Successful!</span>
            </div>
            <p className="text-sm text-gray-600">{result.content}</p>
          </div>
        );

      case 'error':
        return (
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="text-red-600" size={20} />
              <span className="font-medium">Configuration Required</span>
            </div>
            <p className="text-sm text-gray-600">{result.content}</p>
          </div>
        );

      default:
        return <div>Unknown result type</div>;
    }
  };

  const getFeatureTitle = () => {
    const titles = {
      'code-assistant': 'AI Code Assistant',
      'procedural': 'Procedural Content Generator',
      'collaboration': 'Real-time Collaboration',
      'analytics': 'Game Analytics',
      'npc-dialogue': 'AI NPC Dialogue Generator',
      'tutorials': 'AI Tutorial Generator',
      'accessibility': 'Accessibility Checker',
      'export': 'Export & Share'
    };
    return titles[feature as keyof typeof titles] || feature;
  };

  const getInputPlaceholder = () => {
    const placeholders = {
      'code-assistant': 'Describe the issue or what you want to improve...',
      'procedural': 'Level type: dungeon, platformer, maze, or open-world',
      'collaboration': 'Email address to invite...',
      'analytics': 'No input needed',
      'npc-dialogue': 'Describe the NPC and context...',
      'tutorials': 'What aspect of the game to focus on...',
      'accessibility': 'No input needed',
      'export': 'No input needed'
    };
    return placeholders[feature as keyof typeof placeholders] || 'Enter your input...';
  };

  const requiresInput = () => {
    return !['analytics', 'accessibility', 'export'].includes(feature);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{getFeatureTitle()}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {!result && (
            <div className="space-y-4">
              {requiresInput() && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Input
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={getInputPlaceholder()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
              )}

              <button
                onClick={handleFeatureAction}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  <>
                    Execute {getFeatureTitle()}
                  </>
                )}
              </button>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Results</h3>
                <button
                  onClick={() => setResult(null)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Run Again
                </button>
              </div>
              {renderResult()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};