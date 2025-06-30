// Fallback code generators and helpers for GameGenerator

export function generateMemoryGameCode(gameData, prompt) {
  // ...existing code...
}

export function generatePuzzleGameCode(gameData, prompt) {
  // ...existing code...
}

export function generateRacingGameCode(gameData, prompt) {
  // ...existing code...
}

export function generateStrategyGameCode(gameData, prompt) {
  // ...existing code...
}

export function generateSimulationGameCode(gameData, prompt) {
  // ...existing code...
}

export function generateCardGameCode(gameData, prompt) {
  // ...existing code...
}

export function generateBoardGameCode(gameData, prompt) {
  // ...existing code...
}

export function generateShooterGameCode(gameData, prompt) {
  // ...existing code...
}

export function generateRPGGameCode(gameData, prompt) {
  // ...existing code...
}

export function getGameTypeRules(gameType) {
  // ...existing code...
}

export function getGameTypeMechanics(gameType) {
  // ...existing code...
}

export function getGameTypeCharacters(gameType) {
  // ...existing code...
}

export function getGameTypeItems(gameType) {
  // ...existing code...
}

export function getGameTypeLevels(gameType) {
  // ...existing code...
}

export function getGameTypeControls(gameType) {
  // ...existing code...
}

export function getGameTypeImagePrompts(gameType, theme) {
  // ...existing code...
}

export function getGameTypeSoundPrompts(gameType) {
  // ...existing code...
}

// Minimal fallback for GameGenerator if AI output cannot be parsed
export function createIntelligentFallback(prompt, rawContent = '') {
  return {
    gameName: 'Untitled Prototype',
    description: 'AI output could not be parsed. This is a minimal fallback. See below for raw Llama output.',
    genre: 'Unknown',
    theme: 'Unknown',
    difficulty: 'medium',
    rules: '',
    mechanics: [],
    gameCode: '',
    characters: [],
    items: [],
    levels: [],
    controls: {},
    imagePrompts: [],
    soundPrompts: [],
    cssStyles: '',
    usedFallback: true,
    fallbackReason: 'AI output could not be parsed. See below for raw output.',
    rawLlamaOutput: rawContent
  };
}
