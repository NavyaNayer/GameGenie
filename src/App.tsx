import React, { useState } from 'react';
import { PromptInput } from './components/PromptInput';
import { GamePreview } from './components/GamePreview';
import { GameGenerator } from './services/gameGenerator';
import { FileWriter } from './utils/fileWriter';
import { ZipDownloader } from './utils/zipDownloader';
import { AlertCircle, CheckCircle } from 'lucide-react';

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

  const handleGenerateGame = async (prompt: string) => {
    setIsGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      const gameData = await GameGenerator.generateGame(prompt);
      const files = FileWriter.createGameFiles(gameData);

      setGeneratedGame({
        gameData,
        files,
        originalPrompt: prompt
      });

      setSuccess('Game generated successfully! Your playable game is ready.');
    } catch (err) {
      console.error('Game generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate game. Please try again.');
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

      const updatedFiles = FileWriter.createGameFiles(updatedGameData);

      setGeneratedGame({
        ...generatedGame,
        gameData: updatedGameData,
        files: updatedFiles
      });

      setSuccess(`${component} regenerated successfully!`);
    } catch (err) {
      console.error('Component regeneration error:', err);
      setError(`Failed to regenerate ${component}. Please try again.`);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleDownloadGame = async () => {
    if (!generatedGame) return;

    try {
      await ZipDownloader.downloadGameFiles(generatedGame.gameData, generatedGame.files);
      setSuccess('Game package downloaded successfully!');
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download game package. Please try again.');
    }
  };

  const dismissMessage = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
                  className="text-red-600 hover:text-red-800 ml-3"
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
                  className="text-green-600 hover:text-green-800 ml-3"
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
            <GamePreview
              gameData={generatedGame.gameData}
              files={generatedGame.files}
              onDownload={handleDownloadGame}
              onRegenerate={handleRegenerateComponent}
              isRegenerating={isRegenerating}
            />
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-600">
          <p className="text-sm">
            Powered by Together AI • Llama 3.3 • Built with React & TypeScript
          </p>
          <p className="text-xs mt-2">
            Generate complete, playable games from natural language descriptions
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;