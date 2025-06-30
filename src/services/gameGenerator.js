import axios from 'axios';
import { API_CONFIG } from '../config/apiKeys';
import * as Generation from './generation';

export class GameGenerator {
  // --- Rapid Game Prototyping Engine ---
  static async generateGame(prompt) {
    try {
      console.log('Generating prototype for prompt:', prompt);
      
      const response = await axios.post(
        API_CONFIG.TOGETHER_AI.endpoint,
        {
          model: API_CONFIG.TOGETHER_AI.model,
          messages: [
            {
              role: 'system',
              content: `You are an expert game prototyper who creates rapid, playable HTML5 game prototypes. You can create ANY type of game prototype based on the user's prompt - there are no limitations or restrictions.

CRITICAL REQUIREMENTS:
1. Analyze the prompt and create a game prototype that EXACTLY matches what the user described
2. Generate COMPLETE, FUNCTIONAL JavaScript code for a playable prototype that runs immediately
3. Use HTML5 Canvas with basic game loops, input handling, and core mechanics
4. Include basic collision detection, game states, win/lose conditions
5. Make prototypes that are fun and engaging to play-test
6. Support ANY game type: puzzle, strategy, simulation, arcade, RPG, etc.

GAME TYPES YOU CAN PROTOTYPE (not limited to):
- Memory/Card prototypes (flip cards, match pairs)
- Puzzle prototypes (Tetris, match-3, sliding puzzles)
- Strategy prototypes (chess, checkers, tower defense)
- Simulation prototypes (city builder, farming, life sim)
- Arcade prototypes (snake, breakout, space invaders)
- RPG prototypes (turn-based combat, character progression)
- Racing prototypes (top-down, side-scrolling)
- Platformer prototypes (jumping, collecting)
- Shooting prototypes (bullet hell, target practice)
- Card prototypes (solitaire, poker, blackjack)
- Board prototypes (tic-tac-toe, connect four)
- Educational prototypes (math, typing, trivia)
- Creative prototypes (drawing, music, building)

Return a JSON object with this EXACT structure:
{
  "gameName": "string",
  "description": "string", 
  "genre": "string",
  "theme": "string",
  "difficulty": "easy|medium|hard",
  "rules": "string",
  "mechanics": ["array", "of", "mechanics"],
  "gameCode": "COMPLETE WORKING JAVASCRIPT CODE",
  "characters": [{"name": "string", "type": "string", "description": "string", "stats": {"health": 100, "attack": 10, "defense": 5, "speed": 8}, "abilities": ["array"]}],
  "items": [{"name": "string", "type": "string", "description": "string", "effect": "string", "rarity": "common|rare|epic|legendary"}],
  "levels": [{"name": "string", "description": "string", "environment": "string", "objectives": ["array"], "enemies": ["array"], "items": ["array"]}],
  "controls": {"movement": "string", "action": "string", "special": "string"},
  "imagePrompts": ["array", "of", "prompts"],
  "soundPrompts": ["array", "of", "prompts"],
  "cssStyles": "additional CSS if needed"
}

GAME PROTOTYPE CODE REQUIREMENTS:
- Must be complete, working JavaScript for a prototype that runs immediately
- Include basic canvas setup, game loop, input handling
- Implement all core mechanics described in the prompt
- Have clear win/lose conditions and scoring
- Include at least one level or increasing difficulty
- Be genuinely playable and fun to test
- Handle edge cases and errors gracefully
- Make functions globally available: window.startGame, window.pauseGame, window.resetGame`
            },
            {
              role: 'user',
              content: `Create a rapid, playable game prototype based on this prompt: "${prompt}"

Analyze the prompt carefully and create a prototype that EXACTLY matches what was described. Be creative and innovative - there are no limitations on what type of prototype you can create.

Requirements:
1. The prototype must be immediately playable when the Start Game button is clicked
2. Include all mechanics and features mentioned in the prompt
3. Have basic game physics and collision detection where needed
4. Include clear objectives and win/lose conditions
5. Be genuinely fun and engaging to play-test
6. Generate complete, working code with no placeholders

Generate the complete prototype now.`
            }
          ],
          max_tokens: 4000,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${API_CONFIG.TOGETHER_AI.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices?.[0]?.message?.content;
      console.log('Full Together AI API response:', JSON.stringify(response.data, null, 2));
      console.log('AI Response content:', content);
      
      // Extract JSON from the response
      let gameData;
      let usedFallback = false;
      let fallbackReason = '';
      try {
        // Try to extract the largest valid JSON object from the response
        const jsonMatch = Generation.extractLargestJsonObject(content);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch);
          // Ensure the parsed object is valid and has required keys
          if (
            typeof parsed === 'object' &&
            !Array.isArray(parsed) &&
            parsed.gameName &&
            (parsed.gameCode || parsed.prototypeCode)
          ) {
            gameData = parsed;
            console.log('Successfully parsed prototype data:', gameData.gameName);
          } else {
            fallbackReason = 'Parsed JSON is not a valid prototype object (missing gameName or gameCode/prototypeCode).';
            throw new Error(fallbackReason);
          }
        } else {
          fallbackReason = 'No JSON object found in AI response.';
          throw new Error(fallbackReason);
        }
      } catch (parseError) {
        usedFallback = true;
        console.error('Failed to parse AI response:', parseError);
        console.log('Raw AI response:', content);
        console.warn('Fallback reason:', fallbackReason || parseError.message);
        gameData = Generation.createIntelligentFallback(prompt);
        gameData.fallbackReason = fallbackReason || parseError.message;
      }

      // Validate and enhance the prototype code
      gameData.gameCode = Generation.validateAndEnhanceGameCode(gameData.gameCode, gameData, prompt);
      // Ensure all required fields exist
      gameData = Generation.validateGameData(gameData, prompt);
      // Add fallback flag and reason for UI feedback
      gameData.usedFallback = usedFallback;
      if (usedFallback) gameData.fallbackReason = fallbackReason;
      console.log('Prototype generation completed:', gameData.gameName);
      return gameData;
    } catch (error) {
      console.error('Prototype generation failed:', error);
      return Generation.createIntelligentFallback(prompt);
    }
  }
}