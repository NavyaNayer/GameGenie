import React, { useState } from 'react';
import { PromptInput } from './components/PromptInput';
import { GamePreview } from './components/GamePreview';
import { Sidebar } from './components/Sidebar';
import { GameGenerator } from './services/gameGenerator';
import { FileWriter } from './utils/fileWriter';
import { ZipDownloader } from './utils/zipDownloader';
import { AnalyticsService } from './services/analyticsService';
import { AlertCircle, CheckCircle, Menu, X } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { GameConfig } from './components/GameConfig';
import * as Generation from './services/generation';

interface GeneratedGame {
  gameData: any;
  files: Record<string, string>;
  originalPrompt: string;
}

function App() {
  const [generatedGame, setGeneratedGame] = useState<GeneratedGame | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [gameConfig, setGameConfig] = useState<any>(null);

  // Listen for analytics events from game iframe
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'analytics') {
        AnalyticsService.recordEvent(event.data.event);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleGenerateGame = async (prompt: string) => {
    setIsGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      let gameData = await GameGenerator.generateGame(prompt);
      let files = FileWriter.createPrototypeFiles(gameData);

      // If fallback is used but rawLlamaOutput exists, try to parse it for UI
      if (gameData.usedFallback && gameData.rawLlamaOutput) {
        try {
          const jsonMatch = Generation.extractLargestJsonObject(gameData.rawLlamaOutput);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch);
            if (parsed && typeof parsed === 'object') {
              gameData = { ...gameData, ...parsed, usedFallback: true, fallbackReason: gameData.fallbackReason, rawLlamaOutput: gameData.rawLlamaOutput };
              files = FileWriter.createPrototypeFiles(gameData);
              // Always use Together AI's gameCode for preview/code tab if present
              if (parsed.gameCode && typeof parsed.gameCode === 'string' && parsed.gameCode.trim().length > 0) {
                files['game.js'] = parsed.gameCode;
                gameData.fallbackParseWarning = 'Prototype validation failed, but code from Together AI is shown below. Some features may be missing.';
              }
              // Always patch index.html to ensure a single <canvas id="prototypeCanvas"> as first child of <body>
              if (files['index.html']) {
                let html = files['index.html'];
                // Remove ALL existing canvas with id="prototypeCanvas" to avoid duplicates
                html = html.replace(/<canvas[^>]*id=["']prototypeCanvas["'][^>]*>[\s\S]*?<\/canvas>/gi, '');
                if (/<body[^>]*>/i.test(html)) {
                  // Insert canvas as the first child of <body>
                  html = html.replace(/(<body[^>]*>)/i, `$1\n<canvas id="prototypeCanvas" width="800" height="600" style="display:block;margin:2rem auto;border:2px solid #667eea;border-radius:10px;"></canvas>`);
                } else if (/<html[^>]*>/i.test(html)) {
                  // If <body> is missing but <html> exists, add <body> with canvas
                  html = html.replace(/<html[^>]*>/i, match => `${match}\n<body>\n<canvas id="prototypeCanvas" width="800" height="600" style="display:block;margin:2rem auto;border:2px solid #667eea;border-radius:10px;"></canvas>`);
                  if (!/<\/body>/i.test(html)) {
                    html += '\n</body>';
                  }
                } else {
                  // If both <body> and <html> are missing, wrap everything
                  html = `<html>\n<body>\n<canvas id="prototypeCanvas" width="800" height="600" style="display:block;margin:2rem auto;border:2px solid #667eea;border-radius:10px;"></canvas>\n${html}\n</body>\n</html>`;
                }
                files['index.html'] = html;
              }
            }
          }
        } catch (e) {
          gameData.fallbackParseWarning = 'Could not parse raw Llama output as JSON.';
        }
      }

      // Inject analytics tracking into game code
      if (files['game.js']) {
        files['game.js'] = AnalyticsService.injectAnalyticsCode(files['game.js'], gameData.gameName);
      }

      setGeneratedGame({
        gameData,
        files,
        originalPrompt: prompt
      });

      if (gameData.usedFallback) {
        // setSuccess(`⚠️ Generated with fallback: ${gameData.fallbackReason || 'AI output could not be parsed. Showing best effort.'}`);
        // toast(`Generated with fallback: ${gameData.fallbackReason || 'AI output could not be parsed.'}`, { icon: '⚠️' });
      } else {
        setSuccess(`🎮 ${gameData.gameName} generated successfully! Your ${gameData.genre?.toLowerCase() || ''} game is ready to play.`);
        toast.success(`Generated ${gameData.gameName}!`);
      }
    } catch (err) {
      console.error('Game generation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate game. Please try again.';
      setError(errorMessage);
      toast.error('Game generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateComponent = async (component: string) => {
    if (!generatedGame) return;

    setIsRegenerating(true);
    setError(null);

    try {
      const updatedGameData = await GameGenerator.regenerateComponent(
        generatedGame.gameData,
        component,
        generatedGame.originalPrompt
      );

      const updatedFiles = FileWriter.createPrototypeFiles(updatedGameData);

      // Re-inject analytics tracking
      if (updatedFiles['game.js']) {
        updatedFiles['game.js'] = AnalyticsService.injectAnalyticsCode(updatedFiles['game.js'], updatedGameData.gameName);
      }

      setGeneratedGame({
        ...generatedGame,
        gameData: updatedGameData,
        files: updatedFiles
      });

      setSuccess(`✨ ${component.replace(/([A-Z])/g, ' $1').toLowerCase()} regenerated with fresh content!`);
      toast.success(`Regenerated ${component}!`);
    } catch (err) {
      console.error('Component regeneration error:', err);
      setError(`Failed to regenerate ${component}. Please try again.`);
      toast.error(`Failed to regenerate ${component}`);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleDownloadGame = async () => {
    if (!generatedGame) return;

    try {
      await ZipDownloader.downloadGameFiles(generatedGame.gameData, generatedGame.files);
      setSuccess('📦 Game package downloaded successfully! Extract and open index.html to play.');
      toast.success('Game downloaded!');
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download game package. Please try again.');
      toast.error('Download failed');
    }
  };

  const dismissMessage = () => {
    setError(null);
    setSuccess(null);
  };

  const handleGameUpdate = (updatedData: any) => {
    if (generatedGame) {
      const updatedFiles = FileWriter.createPrototypeFiles(updatedData);
      setGeneratedGame({
        ...generatedGame,
        gameData: updatedData,
        files: updatedFiles
      });
    }
  };

  const handleConfigChange = (newConfig: any) => {
    setGameConfig(newConfig);
    if (generatedGame) {
      handleGameUpdate(newConfig);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <img src="/logo.png" alt="Game Genie Logo" className="w-24 h-24 absolute top-6 right-6 z-40" />
        <Sidebar 
          gameData={generatedGame?.gameData}
          files={generatedGame?.files}
          onUpdate={handleGameUpdate}
        />
      </div>

      {/* Mobile Header with Menu */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="flex flex-col items-center">
            <img src="/logo.png" alt="Game Genie Logo" className="w-10 h-10 mb-1" />
            <h1 className="text-xl font-bold text-indigo-700">Game Genie</h1>
          </div>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileSidebar(false)} />
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-indigo-700">Game Genie Features</h2>
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="h-full overflow-y-auto pb-20">
              <Sidebar 
                gameData={generatedGame?.gameData}
                files={generatedGame?.files}
                onUpdate={handleGameUpdate}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:ml-80 transition-all duration-300">
        <div className="container mx-auto px-4 py-8 max-w-6xl lg:pt-8 pt-20">
          {/* Status Messages */}
          {(error || success) && (
            <div className="mb-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                  <AlertCircle className="text-red-600 mr-3 mt-0.5 flex-shrink-0" size={20} />
                  <div className="flex-1">
                    <p className="text-red-800">{error}</p>
                  </div>
                  <button
                    onClick={dismissMessage}
                    className="text-red-600 hover:text-red-800 ml-3 text-xl leading-none"
                  >
                    ×
                  </button>
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                  <CheckCircle className="text-green-600 mr-3 mt-0.5 flex-shrink-0" size={20} />
                  <div className="flex-1">
                    <p className="text-green-800">{success}</p>
                  </div>
                  <button
                    onClick={dismissMessage}
                    className="text-green-600 hover:text-green-800 ml-3 text-xl leading-none"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Main Content */}
          <div className="space-y-8">
            <PromptInput onSubmit={handleGenerateGame} isGenerating={isGenerating} />
            
            {generatedGame && (
              <>
                <GamePreview
                  gameData={generatedGame.gameData}
                  files={generatedGame.files}
                  onDownload={handleDownloadGame}
                  onRegenerate={handleRegenerateComponent}
                  isRegenerating={isRegenerating}
                  onConfigChange={handleConfigChange}
                />
              </>
            )}
          </div>

          {/* Footer */}
          <footer className="mt-16 text-center text-gray-600">
            <p className="text-sm">
              Made by Team Game Genie
            </p>
            <p className="text-xs mt-2">
              Game Genie: Complete AI-powered game prototyping suite with 9 advanced features
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;