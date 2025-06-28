import React, { useState } from 'react';
import { Wand2, Sparkles, Gamepad2, Loader2 } from 'lucide-react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isGenerating: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, isGenerating }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onSubmit(prompt.trim());
    }
  };

  const examplePrompts = [
    "A fantasy RPG where a mage fights evil spirits in haunted dungeons",
    "A space shooter where you defend Earth from alien invasion",
    "A puzzle platformer with a robot collecting energy cores",
    "A steampunk adventure with airships and mechanical creatures",
    "A medieval strategy game where you build and defend castles",
    "A cyberpunk racing game through neon-lit city streets"
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Wand2 className="text-blue-600 mr-3" size={32} />
          <h1 className="text-3xl font-bold text-gray-900">Prompt-to-Game Generator</h1>
          <Sparkles className="text-purple-600 ml-3" size={32} />
        </div>
        <p className="text-gray-600 text-lg leading-relaxed">
          Transform your game ideas into playable experiences using AI. 
          Describe any game concept and watch it come to life!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Describe your game idea
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: A fantasy RPG where a mage fights evil spirits in haunted dungeons with magic spells and ancient artifacts..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
            rows={4}
          />
        </div>

        <button
          type="submit"
          disabled={!prompt.trim() || isGenerating}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Generating Game...
            </>
          ) : (
            <>
              <Gamepad2 size={20} />
              Generate Game
            </>
          )}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Try these examples:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              onClick={() => setPrompt(example)}
              className="text-left p-3 text-sm bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-colors"
            >
              "{example}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};