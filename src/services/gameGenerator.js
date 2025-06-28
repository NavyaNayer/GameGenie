import axios from 'axios';

const TOGETHER_AI_CONFIG = {
  apiKey: 'tgp_v1_ft3sc3-Tbdqy9xtVnycCuOTvsayaD-39nf4zQDadH5I',
  endpoint: 'https://api.together.xyz/v1/chat/completions',
  model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free'
};

const SYSTEM_PROMPT = `You are an expert game developer and designer. Given a game concept, create a complete, structured game specification that includes all necessary components for a playable web-based game.

CRITICAL: Return ONLY a valid JSON object. Do not include any markdown formatting, code blocks, or explanatory text. The response must start with { and end with }.

Return your response as a valid JSON object with this exact structure:

{
  "gameName": "Creative name for the game",
  "description": "Engaging 2-3 sentence description",
  "genre": "Game genre (e.g., RPG, Platformer, Puzzle)",
  "rules": "Clear, concise game rules and objectives",
  "mechanics": [
    "Core gameplay mechanic 1",
    "Core gameplay mechanic 2"
  ],
  "characters": [
    {
      "name": "Character name",
      "type": "player",
      "description": "Character description",
      "stats": {"health": 100, "attack": 10, "defense": 5}
    }
  ],
  "items": [
    {
      "name": "Item name",
      "type": "weapon",
      "description": "Item description",
      "effect": "Item effect"
    }
  ],
  "levels": [
    {
      "name": "Level name",
      "description": "Level description",
      "objectives": ["Objective 1"],
      "enemies": ["Enemy name"],
      "items": ["Item name"]
    }
  ],
  "gameCode": "Complete HTML5 Canvas game code in JavaScript. Include canvas setup, game loop, input handling, collision detection, and win/lose conditions. Make it fully playable.",
  "htmlStructure": "<canvas id='gameCanvas' width='800' height='600'></canvas>",
  "cssStyles": "body { margin: 0; } canvas { border: 1px solid black; }",
  "imagePrompts": [
    {
      "type": "character",
      "name": "Player character",
      "prompt": "Detailed DALL-E style prompt for generating this asset"
    }
  ]
}

IMPORTANT: 
- Ensure all strings are properly escaped
- Do not use line breaks within string values
- Use only standard ASCII characters
- Make the game code functional and complete
- Include proper game states, collision detection, scoring, and win/lose conditions`;

export class GameGenerator {
  static async generateGame(userPrompt) {
    try {
      const response = await axios.post(
        TOGETHER_AI_CONFIG.endpoint,
        {
          model: TOGETHER_AI_CONFIG.model,
          messages: [
            {
              role: 'system',
              content: SYSTEM_PROMPT
            },
            {
              role: 'user',
              content: `Create a complete game based on this concept: ${userPrompt}`
            }
          ],
          max_tokens: 4096, // Increased from 4000 to 4096 (Together API max for Llama-3-70B)
          temperature: 0.7,
          top_p: 0.9,
          stop: null
        },
        {
          headers: {
            'Authorization': `Bearer ${TOGETHER_AI_CONFIG.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      console.log('Raw AI response:', content);
      return this.parseGameResponse(content);
    } catch (error) {
      console.error('Game generation failed:', error);
      if (error.response) {
        throw new Error(`API Error: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown error'}`);
      }
      throw new Error(`Failed to generate game: ${error.message}`);
    }
  }

  // Generate multiple games in parallel from an array of prompts
  static async generateMultipleGames(userPrompts) {
    if (!Array.isArray(userPrompts) || userPrompts.length === 0) {
      throw new Error('userPrompts must be a non-empty array');
    }
    // Map each prompt to a generateGame call
    const gamePromises = userPrompts.map(prompt => this.generateGame(prompt));
    // Wait for all games to be generated
    return Promise.all(gamePromises);
  }

  static parseGameResponse(content) {
    try {
      // Use the robust fixAndParseJSON for all parsing
      return this.fixAndParseJSON(content);
    } catch (error) {
      console.error('Failed to parse game response:', error);
      console.error('Content that failed to parse:', content);
      throw new Error('Failed to parse game response: ' + error.message + '\nRaw response: ' + content.slice(0, 500));
    }
  }

  static sanitizeJsonString(jsonString) {
    // Remove control characters that cause JSON parsing issues
    jsonString = jsonString.replace(/[\x00-\x1F\x7F]/g, '');
    
    // Fix common escape sequence issues
    jsonString = jsonString.replace(/\\/g, '\\\\');
    jsonString = jsonString.replace(/\\\\"/g, '\\"');
    jsonString = jsonString.replace(/\\\\n/g, '\\n');
    jsonString = jsonString.replace(/\\\\t/g, '\\t');
    
    // Fix unescaped quotes in strings
    jsonString = jsonString.replace(/"([^"]*)"([^"]*)"([^"]*)":/g, '"$1\\"$2\\"$3":');
    
    return jsonString;
  }

  static validateAndFixGameData(gameData) {
    // Provide defaults for missing required fields
    const defaults = {
      gameName: gameData.gameName || 'Generated Game',
      description: gameData.description || 'An exciting game generated from your prompt.',
      genre: gameData.genre || 'Adventure',
      rules: gameData.rules || 'Use arrow keys to move and spacebar to interact.',
      mechanics: gameData.mechanics || ['Movement', 'Interaction'],
      characters: gameData.characters || [{
        name: 'Player',
        type: 'player',
        description: 'The main character',
        stats: { health: 100, attack: 10, defense: 5 }
      }],
      items: gameData.items || [{
        name: 'Health Potion',
        type: 'consumable',
        description: 'Restores health',
        effect: 'Heal 50 HP'
      }],
      levels: gameData.levels || [{
        name: 'Level 1',
        description: 'The first level',
        objectives: ['Reach the end'],
        enemies: ['Basic Enemy'],
        items: ['Health Potion']
      }],
      gameCode: gameData.gameCode || this.getDefaultGameCode(),
      htmlStructure: gameData.htmlStructure || '<canvas id="gameCanvas" width="800" height="600"></canvas>',
      cssStyles: gameData.cssStyles || 'canvas { border: 2px solid #333; }',
      imagePrompts: gameData.imagePrompts || [{
        type: 'character',
        name: 'Player Character',
        prompt: 'A heroic character in a fantasy setting, pixel art style'
      }]
    };

    return { ...defaults, ...gameData };
  }

  static getDefaultGameCode() {
    return `
// Default Game Code
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
let gameState = {
  player: { x: 50, y: 50, width: 30, height: 30, speed: 5 },
  score: 0,
  gameRunning: true
};

// Input handling
const keys = {};
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

// Game loop
function gameLoop() {
  if (!gameState.gameRunning) return;
  
  // Clear canvas
  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Handle input
  if (keys['ArrowLeft'] && gameState.player.x > 0) {
    gameState.player.x -= gameState.player.speed;
  }
  if (keys['ArrowRight'] && gameState.player.x < canvas.width - gameState.player.width)) {
    gameState.player.x += gameState.player.speed;
  }
  if (keys['ArrowUp'] && gameState.player.y > 0) {
    gameState.player.y -= gameState.player.speed;
  }
  if (keys['ArrowDown'] && gameState.player.y < canvas.height - gameState.player.height) {
    gameState.player.y += gameState.player.speed;
  }
  
  // Draw player
  ctx.fillStyle = '#FF6B6B';
  ctx.fillRect(gameState.player.x, gameState.player.y, gameState.player.width, gameState.player.height);
  
  // Draw score
  ctx.fillStyle = '#333';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + gameState.score, 10, 30);
  
  requestAnimationFrame(gameLoop);
}

// Initialize game
function initGame() {
  gameLoop();
}

function startGame() {
  gameState.gameRunning = true;
  gameLoop();
}

function pauseGame() {
  gameState.gameRunning = !gameState.gameRunning;
  if (gameState.gameRunning) gameLoop();
}

function resetGame() {
  gameState = {
    player: { x: 50, y: 50, width: 30, height: 30, speed: 5 },
    score: 0,
    gameRunning: true
  };
  gameLoop();
}
`;
  }

  static createFallbackGame() {
    return {
      gameName: 'Simple Adventure Game',
      description: 'A basic adventure game where you control a character and explore the world.',
      genre: 'Adventure',
      rules: 'Use arrow keys to move your character around the screen.',
      mechanics: ['Movement', 'Exploration'],
      characters: [{
        name: 'Hero',
        type: 'player',
        description: 'A brave adventurer',
        stats: { health: 100, attack: 15, defense: 10 }
      }],
      items: [{
        name: 'Magic Sword',
        type: 'weapon',
        description: 'A powerful magical weapon',
        effect: 'Increases attack by 10'
      }],
      levels: [{
        name: 'Starting Area',
        description: 'A peaceful meadow where your adventure begins',
        objectives: ['Explore the area'],
        enemies: [],
        items: ['Magic Sword']
      }],
      gameCode: this.getDefaultGameCode(),
      htmlStructure: '<canvas id="gameCanvas" width="800" height="600"></canvas>',
      cssStyles: 'canvas { border: 2px solid #333; background: #f0f0f0; }',
      imagePrompts: [{
        type: 'character',
        name: 'Hero Character',
        prompt: 'A brave fantasy hero character, pixel art style, colorful and friendly'
      }]
    };
  }

  static async regenerateComponent(originalGame, component, userPrompt) {
    const componentPrompts = {
      gameCode: 'Regenerate only the game code (JavaScript) for this game, keeping the same concept but with improved gameplay mechanics.',
      characters: 'Regenerate only the characters array with new, more interesting characters while keeping the same game concept.',
      levels: 'Regenerate only the levels array with new, more challenging level designs.',
      items: 'Regenerate only the items array with new, more creative items and power-ups.',
      imagePrompts: 'Regenerate only the image prompts with more detailed and artistic descriptions.'
    };

    try {
      const response = await axios.post(
        TOGETHER_AI_CONFIG.endpoint,
        {
          model: TOGETHER_AI_CONFIG.model,
          messages: [
            {
              role: 'system',
              content: `${SYSTEM_PROMPT}\n\nOnly regenerate the "${component}" component and return the complete JSON structure with the updated component. Ensure the JSON is valid and properly formatted.`
            },
            {
              role: 'user',
              content: `${componentPrompts[component]}\n\nOriginal game concept: ${userPrompt}\n\nCurrent game data: ${JSON.stringify(originalGame, null, 2)}`
            }
          ],
          max_tokens: 4096, // Increased from 4000 to 4096 (Together API max for Llama-3-70B)
          temperature: 0.8,
          top_p: 0.9
        },
        {
          headers: {
            'Authorization': `Bearer ${TOGETHER_AI_CONFIG.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      const updatedGame = this.parseGameResponse(content);
      
      // Merge the updated component with the original game
      return { ...originalGame, ...updatedGame };
    } catch (error) {
      console.error('Component regeneration failed:', error);
      throw new Error(`Failed to regenerate ${component}: ${error.message}`);
    }
  }

  /**
   * Attempts to robustly fix and parse a possibly malformed JSON string from LLaMA.
   * Handles truncated arrays, trailing commas, unclosed braces/brackets, and invalid characters.
   * @param {string} raw - The raw LLaMA response string
   * @returns {object} - The parsed JSON object
   * @throws {Error} - If unable to fix and parse
   */
  static fixAndParseJSON(raw) {
    let content = raw.trim();
    // Remove code block markers and backticks
    content = content.replace(/```json|```|`/g, '');
    // Replace smart quotes with normal quotes
    content = content.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
    // Remove any control characters
    content = content.replace(/[\x00-\x1F\x7F]/g, '');
    // Remove trailing commas before closing brackets/braces
    content = content.replace(/,\s*([\}\]])/g, '$1');
    // Find the first '{' and last '}' to get the main JSON object
    const jsonStart = content.indexOf('{');
    const jsonEnd = content.lastIndexOf('}');
    if (jsonStart === -1) throw new Error('No opening { found in response.');
    let fixed = content.slice(jsonStart, jsonEnd === -1 ? undefined : jsonEnd + 1);
    // Try to fix truncated arrays/objects and ensure closure
    for (let i = 0; i < 12; i++) {
      try {
        // Remove trailing incomplete string
        fixed = fixed.replace(/"[^"\n]*$/, '');
        // Remove trailing comma and any partial field
        fixed = fixed.replace(/,[^,\{\[]*$/, '');
        // Remove trailing incomplete array (e.g., [ "foo", "bar", )
        fixed = fixed.replace(/,?\s*\[[^\]]*$/, '');
        // Remove trailing incomplete object (e.g., { "foo": "bar", )
        fixed = fixed.replace(/,?\s*\{[^\}]*$/, '');
        // Try to close open arrays/objects
        const openBraces = (fixed.match(/\{/g) || []).length;
        const closeBraces = (fixed.match(/\}/g) || []).length;
        const openBrackets = (fixed.match(/\[/g) || []).length;
        const closeBrackets = (fixed.match(/\]/g) || []).length;
        if (openBrackets > closeBrackets) fixed += ']';
        if (openBraces > closeBraces) fixed += '}';
        // Try parsing
        return JSON.parse(fixed);
      } catch (e) {
        // Continue fixing
      }
    }
    throw new Error('Unable to fix and parse JSON. Raw (truncated) input: ' + raw.slice(0, 500));
  }
}