export class FileWriter {
  static createGameFiles(gameData) {
    const files = {
      'index.html': this.generateHTML(gameData),
      'game.js': this.generateGameJS(gameData),
      'style.css': this.generateCSS(gameData),
      'assets/prompts.json': this.generateAssetPrompts(gameData),
      'README.md': this.generateReadme(gameData),
      'game-data.json': JSON.stringify(gameData, null, 2)
    };

    return files;
  }

  static generateHTML(gameData) {
    // Ensure game code is properly formatted and doesn't contain problematic characters
    const cleanGameCode = this.cleanGameCode(gameData.gameCode);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.escapeHtml(gameData.gameName)}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .game-container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            padding: 30px;
            max-width: 900px;
            width: 100%;
        }

        .game-header {
            text-align: center;
            margin-bottom: 30px;
        }

        .game-header h1 {
            font-size: 2.5rem;
            color: #2c3e50;
            margin-bottom: 10px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .game-description {
            font-size: 1.1rem;
            color: #7f8c8d;
            line-height: 1.6;
        }

        .game-ui {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 10px;
            flex-wrap: wrap;
            gap: 15px;
        }

        .game-stats {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }

        .game-stats > div {
            font-weight: bold;
            color: #2c3e50;
            padding: 5px 10px;
            background: white;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            font-size: 14px;
        }

        .game-controls {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }

        .game-controls button {
            padding: 8px 16px;
            border: none;
            border-radius: 5px;
            background: #667eea;
            color: white;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
            font-size: 14px;
        }

        .game-controls button:hover {
            background: #5a6fd8;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .game-controls button:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
        }

        #gameCanvas {
            border: 3px solid #667eea;
            border-radius: 10px;
            display: block;
            margin: 0 auto 30px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
            background: #f0f8ff;
        }

        .game-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-top: 30px;
        }

        .rules-section, .mechanics-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
        }

        .rules-section h3, .mechanics-section h3 {
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 1.3rem;
        }

        .rules-section p {
            color: #7f8c8d;
            line-height: 1.6;
        }

        .mechanics-section ul {
            list-style: none;
        }

        .mechanics-section li {
            color: #7f8c8d;
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;
        }

        .mechanics-section li:before {
            content: "→";
            position: absolute;
            left: 0;
            color: #667eea;
            font-weight: bold;
        }

        @media (max-width: 768px) {
            .game-ui {
                flex-direction: column;
                text-align: center;
            }
            
            .game-stats {
                justify-content: center;
            }
            
            .game-info {
                grid-template-columns: 1fr;
            }
            
            #gameCanvas {
                max-width: 100%;
                height: auto;
            }
        }

        ${gameData.cssStyles || ''}
    </style>
</head>
<body>
    <div class="game-container">
        <header class="game-header">
            <h1>${this.escapeHtml(gameData.gameName)}</h1>
            <p class="game-description">${this.escapeHtml(gameData.description)}</p>
        </header>
        
        <div class="game-ui">
            <div class="game-stats">
                <div id="score">Score: 0</div>
                <div id="health">Health: 100</div>
                <div id="level">Level: 1</div>
            </div>
            <div class="game-controls">
                <button id="startBtn">Start Game</button>
                <button id="pauseBtn">Pause</button>
                <button id="resetBtn">Reset</button>
            </div>
        </div>

        <canvas id="gameCanvas" width="800" height="600"></canvas>
        
        <div class="game-info">
            <div class="rules-section">
                <h3>How to Play</h3>
                <p>${this.escapeHtml(gameData.rules)}</p>
            </div>
            
            <div class="mechanics-section">
                <h3>Game Mechanics</h3>
                <ul>
                    ${(gameData.mechanics || []).map(mechanic => `<li>${this.escapeHtml(mechanic)}</li>`).join('')}
                </ul>
            </div>
        </div>
    </div>

    <script>
        // Game initialization and setup
        ${cleanGameCode}

        // UI Integration
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Game loading...');
            
            // Initialize UI elements
            const startBtn = document.getElementById('startBtn');
            const pauseBtn = document.getElementById('pauseBtn');
            const resetBtn = document.getElementById('resetBtn');
            const scoreElement = document.getElementById('score');
            const healthElement = document.getElementById('health');
            const levelElement = document.getElementById('level');
            
            // Button event listeners
            if (startBtn) {
                startBtn.addEventListener('click', function() {
                    console.log('Start button clicked');
                    if (typeof startGame === 'function') {
                        startGame();
                    } else if (typeof initGame === 'function') {
                        initGame();
                    }
                });
            }
            
            if (pauseBtn) {
                pauseBtn.addEventListener('click', function() {
                    console.log('Pause button clicked');
                    if (typeof pauseGame === 'function') {
                        pauseGame();
                    }
                });
            }
            
            if (resetBtn) {
                resetBtn.addEventListener('click', function() {
                    console.log('Reset button clicked');
                    if (typeof resetGame === 'function') {
                        resetGame();
                    }
                });
            }
            
            // Auto-initialize the game
            try {
                if (typeof initGame === 'function') {
                    console.log('Auto-initializing game...');
                    initGame();
                } else if (typeof startGame === 'function') {
                    console.log('Auto-starting game...');
                    startGame();
                } else {
                    console.log('No init function found, game code should handle initialization');
                }
            } catch (error) {
                console.error('Error initializing game:', error);
            }
        });

        // Game data for reference
        const GAME_DATA = ${JSON.stringify(gameData, null, 2)};
    </script>
</body>
</html>`;
  }

  static cleanGameCode(gameCode) {
    if (!gameCode) return this.getDefaultGameCode();
    
    // Remove any problematic characters and ensure proper formatting
    let cleanCode = gameCode
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\r/g, '\n'); // Convert remaining \r to \n
    
    // Ensure the code doesn't contain script tags or other problematic content
    cleanCode = cleanCode.replace(/<script[^>]*>/gi, '').replace(/<\/script>/gi, '');
    
    return cleanCode;
  }

  static getDefaultGameCode() {
    return `
// Default Game Code
const canvas = document.getElementById('gameCanvas');
if (!canvas) {
  console.error('Canvas element not found!');
} else {
  const ctx = canvas.getContext('2d');

  // Game state
  let gameState = {
    player: { x: 100, y: 100, width: 40, height: 40, speed: 5 },
    score: 0,
    health: 100,
    level: 1,
    gameRunning: false,
    keys: {}
  };

  // Input handling
  document.addEventListener('keydown', (e) => {
    gameState.keys[e.key] = true;
    e.preventDefault();
  });
  
  document.addEventListener('keyup', (e) => {
    gameState.keys[e.key] = false;
    e.preventDefault();
  });

  // Update UI elements
  function updateUI() {
    const scoreElement = document.getElementById('score');
    const healthElement = document.getElementById('health');
    const levelElement = document.getElementById('level');
    
    if (scoreElement) scoreElement.textContent = 'Score: ' + gameState.score;
    if (healthElement) healthElement.textContent = 'Health: ' + gameState.health;
    if (levelElement) levelElement.textContent = 'Level: ' + gameState.level;
  }

  // Game loop
  function gameLoop() {
    if (!gameState.gameRunning) return;
    
    // Clear canvas
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Handle input
    if (gameState.keys['ArrowLeft'] && gameState.player.x > 0) {
      gameState.player.x -= gameState.player.speed;
    }
    if (gameState.keys['ArrowRight'] && gameState.player.x < canvas.width - gameState.player.width) {
      gameState.player.x += gameState.player.speed;
    }
    if (gameState.keys['ArrowUp'] && gameState.player.y > 0) {
      gameState.player.y -= gameState.player.speed;
    }
    if (gameState.keys['ArrowDown'] && gameState.player.y < canvas.height - gameState.player.height) {
      gameState.player.y += gameState.player.speed;
    }
    
    // Simple scoring based on movement
    gameState.score += 1;
    
    // Draw player
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(gameState.player.x, gameState.player.y, gameState.player.width, gameState.player.height);
    
    // Draw instructions
    ctx.fillStyle = '#333';
    ctx.font = '16px Arial';
    ctx.fillText('Use arrow keys to move!', 10, canvas.height - 20);
    
    // Update UI
    updateUI();
    
    requestAnimationFrame(gameLoop);
  }

  // Game functions
  function initGame() {
    console.log('Initializing game...');
    gameState.gameRunning = true;
    updateUI();
    gameLoop();
  }

  function startGame() {
    console.log('Starting game...');
    gameState.gameRunning = true;
    gameLoop();
  }

  function pauseGame() {
    console.log('Toggling pause...');
    gameState.gameRunning = !gameState.gameRunning;
    if (gameState.gameRunning) {
      gameLoop();
    }
  }

  function resetGame() {
    console.log('Resetting game...');
    gameState = {
      player: { x: 100, y: 100, width: 40, height: 40, speed: 5 },
      score: 0,
      health: 100,
      level: 1,
      gameRunning: true,
      keys: {}
    };
    updateUI();
    gameLoop();
  }

  // Make functions globally available
  window.initGame = initGame;
  window.startGame = startGame;
  window.pauseGame = pauseGame;
  window.resetGame = resetGame;
}`;
  }

  static escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  static generateGameJS(gameData) {
    return `// ${gameData.gameName} - Generated Game Code
// Genre: ${gameData.genre}
// Generated by Prompt-to-Game Generator

${this.cleanGameCode(gameData.gameCode)}

// Game data for reference
const GAME_DATA = ${JSON.stringify(gameData, null, 2)};`;
  }

  static generateCSS(gameData) {
    const customStyles = gameData.cssStyles || '';
    
    return `/* ${gameData.gameName} Styles */
/* Generated by Prompt-to-Game Generator */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.game-container {
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    padding: 30px;
    max-width: 900px;
    width: 100%;
}

.game-header {
    text-align: center;
    margin-bottom: 30px;
}

.game-header h1 {
    font-size: 2.5rem;
    color: #2c3e50;
    margin-bottom: 10px;
    background: linear-gradient(45deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.game-description {
    font-size: 1.1rem;
    color: #7f8c8d;
    line-height: 1.6;
}

.game-ui {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 10px;
}

.game-stats {
    display: flex;
    gap: 20px;
}

.game-stats > div {
    font-weight: bold;
    color: #2c3e50;
    padding: 5px 10px;
    background: white;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.game-controls {
    display: flex;
    gap: 10px;
}

.game-controls button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background: #667eea;
    color: white;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;
}

.game-controls button:hover {
    background: #5a6fd8;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

#gameCanvas {
    border: 3px solid #667eea;
    border-radius: 10px;
    display: block;
    margin: 0 auto 30px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.game-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin-top: 30px;
}

.rules-section, .mechanics-section {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
}

.rules-section h3, .mechanics-section h3 {
    color: #2c3e50;
    margin-bottom: 15px;
    font-size: 1.3rem;
}

.rules-section p {
    color: #7f8c8d;
    line-height: 1.6;
}

.mechanics-section ul {
    list-style: none;
}

.mechanics-section li {
    color: #7f8c8d;
    margin-bottom: 8px;
    padding-left: 20px;
    position: relative;
}

.mechanics-section li:before {
    content: "→";
    position: absolute;
    left: 0;
    color: #667eea;
    font-weight: bold;
}

@media (max-width: 768px) {
    .game-ui {
        flex-direction: column;
        gap: 15px;
    }
    
    .game-stats {
        flex-wrap: wrap;
        justify-content: center;
    }
    
    .game-info {
        grid-template-columns: 1fr;
    }
    
    #gameCanvas {
        max-width: 100%;
        height: auto;
    }
}

/* Custom game-specific styles */
${customStyles}`;
  }

  static generateAssetPrompts(gameData) {
    return JSON.stringify({
      gameTitle: gameData.gameName,
      assetPrompts: gameData.imagePrompts || [],
      usage: "Use these prompts with DALL-E, Midjourney, or Stable Diffusion to generate game assets",
      instructions: "Each prompt is optimized for AI image generation. Adjust style parameters as needed."
    }, null, 2);
  }

  static generateReadme(gameData) {
    return `# ${gameData.gameName}

## Description
${gameData.description}

**Genre:** ${gameData.genre}

## How to Play
${gameData.rules}

## Game Mechanics
${(gameData.mechanics || []).map(mechanic => `- ${mechanic}`).join('\n')}

## Characters
${(gameData.characters || []).map(char => 
  `### ${char.name} (${char.type})
- **Description:** ${char.description}
- **Stats:** Health: ${char.stats?.health || 'N/A'}, Attack: ${char.stats?.attack || 'N/A'}, Defense: ${char.stats?.defense || 'N/A'}`
).join('\n\n')}

## Items
${(gameData.items || []).map(item => 
  `### ${item.name} (${item.type})
- **Description:** ${item.description}
- **Effect:** ${item.effect}`
).join('\n\n')}

## Levels
${(gameData.levels || []).map((level, index) => 
  `### Level ${index + 1}: ${level.name}
- **Description:** ${level.description}
- **Objectives:** ${(level.objectives || []).join(', ')}
- **Enemies:** ${(level.enemies || []).join(', ')}
- **Items:** ${(level.items || []).join(', ')}`
).join('\n\n')}

## Files
- \`index.html\` - Main game file, open this in a web browser
- \`game.js\` - Game logic and mechanics
- \`style.css\` - Game styling and layout
- \`assets/prompts.json\` - AI image generation prompts for game assets
- \`game-data.json\` - Complete game data structure

## Installation
1. Download all files to a folder on your computer
2. Open \`index.html\` in a modern web browser
3. Start playing!

## Asset Generation
Use the prompts in \`assets/prompts.json\` with AI image generators like:
- DALL-E 2/3
- Midjourney
- Stable Diffusion
- Adobe Firefly

## Generated by
Prompt-to-Game Generator - Powered by Together AI and Llama 3.3
Generated on: ${new Date().toLocaleDateString()}
`;
  }
}