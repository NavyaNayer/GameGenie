export class FileWriter {
  static createPrototypeFiles(prototypeData) {
    const files = {
      'index.html': this.generateHTML(prototypeData),
      'prototype.js': this.generatePrototypeJS(prototypeData),
      'style.css': this.generateCSS(prototypeData),
      'README.md': this.generateReadme(prototypeData),
      'prototype-data.json': JSON.stringify(prototypeData, null, 2)
    };

    return files;
  }

  static generateHTML(prototypeData) {
    // Clean and validate prototype code
    const cleanPrototypeCode = this.cleanPrototypeCode(prototypeData.gameCode);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.escapeHtml(prototypeData.gameName)}</title>
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

        .prototype-container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            padding: 30px;
            max-width: 900px;
            width: 100%;
        }

        .prototype-header {
            text-align: center;
            margin-bottom: 30px;
        }

        .prototype-header h1 {
            font-size: 2.5rem;
            color: #2c3e50;
            margin-bottom: 10px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .prototype-description {
            font-size: 1.1rem;
            color: #7f8c8d;
            line-height: 1.6;
        }

        .prototype-ui {
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

        .prototype-stats {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }

        .prototype-stats > div {
            font-weight: bold;
            color: #2c3e50;
            padding: 5px 10px;
            background: white;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            font-size: 14px;
        }

        .prototype-controls {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }

        .prototype-controls button {
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

        .prototype-controls button:hover {
            background: #5a6fd8;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .prototype-controls button:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
        }

        #prototypeCanvas {
            border: 3px solid #667eea;
            border-radius: 10px;
            display: block;
            margin: 0 auto 30px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
            background: #f0f8ff;
        }

        .prototype-info {
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

        .error-display {
            background: #ff4444;
            color: white;
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            font-family: monospace;
            font-size: 14px;
            white-space: pre-wrap;
        }

        @media (max-width: 768px) {
            .prototype-ui {
                flex-direction: column;
                text-align: center;
            }
            
            .prototype-stats {
                justify-content: center;
            }
            
            .prototype-info {
                grid-template-columns: 1fr;
            }
            
            #prototypeCanvas {
                max-width: 100%;
                height: auto;
            }
        }
    </style>
</head>
<body>
    <div class="prototype-container">
        <header class="prototype-header">
            <h1>${this.escapeHtml(prototypeData.gameName)}</h1>
            <p class="prototype-description">${this.escapeHtml(prototypeData.description)}</p>
        </header>
        
        <div class="prototype-ui">
            <div class="prototype-stats">
                <div id="score">Score: 0</div>
                <div id="health">Health: 100</div>
                <div id="level">Level: 1</div>
            </div>
            <div class="prototype-controls">
                <button id="startBtn">Start Game</button>
                <button id="pauseBtn">Pause</button>
                <button id="resetBtn">Reset</button>
            </div>
        </div>

        <canvas id="prototypeCanvas" width="800" height="600"></canvas>
        
        <div id="errorDisplay" class="error-display" style="display: none;"></div>
        
        <div class="prototype-info">
            <div class="rules-section">
                <h3>How to Play</h3>
                <p>${this.escapeHtml(prototypeData.rules)}</p>
                <div style="margin-top: 15px;">
                    <strong>Controls:</strong><br>
                    Movement: ${this.escapeHtml(prototypeData.controls?.movement || 'Arrow keys')}<br>
                    Action: ${this.escapeHtml(prototypeData.controls?.action || 'Spacebar')}<br>
                    Special: ${this.escapeHtml(prototypeData.controls?.special || 'R to restart')}
                </div>
            </div>
            
            <div class="mechanics-section">
                <h3>Game Mechanics</h3>
                <ul>
                    ${(prototypeData.mechanics || []).map(mechanic => `<li>${this.escapeHtml(mechanic)}</li>`).join('')}
                </ul>
            </div>
        </div>
    </div>

    <script>
        // Global error handler
        window.addEventListener('error', function(e) {
            console.error('Game error:', e.error);
            showError('Game Error: ' + e.error.message + '\\n\\nCheck console for details.');
        });

        // Show error function
        function showError(message) {
            const errorDisplay = document.getElementById('errorDisplay');
            if (errorDisplay) {
                errorDisplay.textContent = message;
                errorDisplay.style.display = 'block';
            }
        }

        // Hide error function
        function hideError() {
            const errorDisplay = document.getElementById('errorDisplay');
            if (errorDisplay) {
                errorDisplay.style.display = 'none';
            }
        }

        // Initialize game when DOM is ready
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM loaded, initializing game...');
            hideError();
            
            // Setup canvas
            const canvas = document.getElementById('prototypeCanvas');
            if (!canvas) {
                showError('Canvas element not found!');
                return;
            }
            
            canvas.width = 800;
            canvas.height = 600;
            console.log('Canvas ready:', canvas.width, 'x', canvas.height);
            
            // Setup button event listeners
            const startBtn = document.getElementById('startBtn');
            const pauseBtn = document.getElementById('pauseBtn');
            const resetBtn = document.getElementById('resetBtn');
            
            if (startBtn) {
                startBtn.addEventListener('click', function() {
                    console.log('Start button clicked');
                    hideError();
                    try {
                        if (typeof window.startGame === 'function') {
                            window.startGame();
                        } else {
                            console.error('startGame function not found');
                            showError('Game not properly loaded. startGame function missing.');
                        }
                    } catch (error) {
                        console.error('Error starting game:', error);
                        showError('Error starting game: ' + error.message);
                    }
                });
            }
            
            if (pauseBtn) {
                pauseBtn.addEventListener('click', function() {
                    console.log('Pause button clicked');
                    try {
                        if (typeof window.pauseGame === 'function') {
                            window.pauseGame();
                        }
                    } catch (error) {
                        console.error('Error pausing game:', error);
                    }
                });
            }
            
            if (resetBtn) {
                resetBtn.addEventListener('click', function() {
                    console.log('Reset button clicked');
                    hideError();
                    try {
                        if (typeof window.resetGame === 'function') {
                            window.resetGame();
                        }
                    } catch (error) {
                        console.error('Error resetting game:', error);
                        showError('Error resetting game: ' + error.message);
                    }
                });
            }
            
            // Load game code
            try {
                console.log('Loading game code...');
                
                // Execute the game code in a try-catch block
                (function() {
                    ${cleanPrototypeCode}
                })();
                
                console.log('Game code loaded successfully!');
                
                // Verify game functions exist
                setTimeout(function() {
                    if (typeof window.startGame !== 'function') {
                        console.warn('startGame function not found, game may not be properly initialized');
                        showError('Game initialization incomplete. Some functions may not work.');
                    }
                }, 100);
                
            } catch (error) {
                console.error('Error loading game:', error);
                showError('Game Loading Error: ' + error.message + '\\n\\nThe game code failed to execute properly.');
                
                // Show error on canvas as well
                const canvas = document.getElementById('prototypeCanvas');
                if (canvas) {
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#ff4444';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = 'white';
                    ctx.font = '24px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('Game Loading Error', canvas.width / 2, canvas.height / 2 - 40);
                    ctx.font = '16px Arial';
                    ctx.fillText('Check error message below', canvas.width / 2, canvas.height / 2 - 10);
                    ctx.fillText('or console for details', canvas.width / 2, canvas.height / 2 + 15);
                    ctx.textAlign = 'left';
                }
            }
        });

        // Game data for reference
        const GAME_DATA = ${JSON.stringify(prototypeData, null, 2)};
    </script>
</body>
</html>`;
  }

  static cleanPrototypeCode(gameCode) {
    if (!gameCode || gameCode.length < 50) {
      console.warn('Game code is missing or too short, using default');
      return this.getDefaultGameCode();
    }
    
    // Clean the code
    let cleanCode = gameCode
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\r/g, '\n'); // Convert remaining \r to \n
    
    // Remove any script tags
    cleanCode = cleanCode.replace(/<script[^>]*>/gi, '').replace(/<\/script>/gi, '');
    
    // Ensure the code has proper structure and error handling
    if (!cleanCode.includes('canvas') && !cleanCode.includes('prototypeCanvas')) {
      console.warn('Game code does not reference canvas, using default');
      return this.getDefaultGameCode();
    }
    
    // Wrap in error handling if not already present
    if (!cleanCode.includes('try {') && !cleanCode.includes('catch')) {
      cleanCode = `
try {
  ${cleanCode}
} catch (gameError) {
  console.error('Game execution error:', gameError);
  throw gameError; // Re-throw to be caught by outer handler
}`;
    }
    
    return cleanCode;
  }

  static getDefaultGameCode() {
    return `
// Default Game - Simple Platformer
console.log('Loading default game...');

const canvas = document.getElementById('prototypeCanvas');
if (!canvas) {
  console.error('Canvas not found!');
  throw new Error('Canvas element not found');
}

const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// Game state
let gameRunning = false;
let score = 0;
let gameOver = false;

// Player
const player = {
  x: 50,
  y: 400,
  width: 30,
  height: 30,
  speedX: 0,
  speedY: 0,
  speed: 5,
  jumpPower: 12,
  onGround: false,
  color: '#4A90E2'
};

// Game objects
const platforms = [
  { x: 0, y: 550, width: 800, height: 50, color: '#8B4513' },
  { x: 200, y: 450, width: 150, height: 20, color: '#8B4513' },
  { x: 450, y: 350, width: 150, height: 20, color: '#8B4513' },
  { x: 650, y: 250, width: 150, height: 20, color: '#8B4513' }
];

const collectibles = [
  { x: 250, y: 420, width: 15, height: 15, color: '#FFD700', collected: false },
  { x: 500, y: 320, width: 15, height: 15, color: '#FFD700', collected: false },
  { x: 700, y: 220, width: 15, height: 15, color: '#FFD700', collected: false }
];

const enemies = [
  { x: 300, y: 520, width: 25, height: 25, color: '#FF4444', speedX: 2 },
  { x: 600, y: 520, width: 25, height: 25, color: '#FF4444', speedX: -2 }
];

// Input handling
const keys = {};
document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  keys[e.code] = true;
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
    e.preventDefault();
  }
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
  keys[e.code] = false;
});

// Collision detection
function checkCollision(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y;
}

// Update game
function update() {
  if (!gameRunning || gameOver) return;
  
  // Player movement
  if (keys['ArrowLeft'] || keys['KeyA']) {
    player.speedX = -player.speed;
  } else if (keys['ArrowRight'] || keys['KeyD']) {
    player.speedX = player.speed;
  } else {
    player.speedX *= 0.8; // Friction
  }

  // Jumping
  if ((keys['ArrowUp'] || keys['Space']) && player.onGround) {
    player.speedY = -player.jumpPower;
    player.onGround = false;
  }

  // Gravity
  player.speedY += 0.6;

  // Update position
  player.x += player.speedX;
  player.y += player.speedY;

  // Platform collision
  player.onGround = false;
  platforms.forEach(platform => {
    if (checkCollision(player, platform) && player.speedY > 0 && player.y < platform.y) {
      player.y = platform.y - player.height;
      player.speedY = 0;
      player.onGround = true;
    }
  });

  // Boundaries
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
  if (player.y > canvas.height) {
    gameOver = true;
  }

  // Update enemies
  enemies.forEach(enemy => {
    enemy.x += enemy.speedX;
    
    // Bounce off platforms
    if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
      enemy.speedX *= -1;
    }
    
    // Check collision with player
    if (checkCollision(player, enemy)) {
      gameOver = true;
    }
  });

  // Check collectibles
  collectibles.forEach(collectible => {
    if (!collectible.collected && checkCollision(player, collectible)) {
      collectible.collected = true;
      score += 100;
    }
  });

  // Check win condition
  if (collectibles.every(c => c.collected)) {
    gameOver = true;
  }
}

// Render game
function render() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#87CEEB');
  gradient.addColorStop(1, '#98FB98');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  if (!gameRunning) {
    // Menu screen
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Platform Adventure', canvas.width / 2, canvas.height / 2 - 50);
    ctx.font = '20px Arial';
    ctx.fillText('Click Start Game or Press SPACE', canvas.width / 2, canvas.height / 2 + 20);
    ctx.textAlign = 'left';
    return;
  }
  
  // Draw platforms
  platforms.forEach(platform => {
    ctx.fillStyle = platform.color;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
  });
  
  // Draw collectibles
  collectibles.forEach(collectible => {
    if (!collectible.collected) {
      ctx.fillStyle = collectible.color;
      ctx.fillRect(collectible.x, collectible.y, collectible.width, collectible.height);
      // Glow effect
      ctx.shadowColor = collectible.color;
      ctx.shadowBlur = 10;
      ctx.fillRect(collectible.x, collectible.y, collectible.width, collectible.height);
      ctx.shadowBlur = 0;
    }
  });
  
  // Draw enemies
  enemies.forEach(enemy => {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });
  
  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  
  // Draw UI
  ctx.fillStyle = 'black';
  ctx.font = 'bold 18px Arial';
  ctx.fillText('Score: ' + score, 10, 30);
  
  const collected = collectibles.filter(c => c.collected).length;
  ctx.fillText('Coins: ' + collected + '/' + collectibles.length, 10, 55);
  
  if (gameOver) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    
    if (collectibles.every(c => c.collected)) {
      ctx.fillText('VICTORY!', canvas.width / 2, canvas.height / 2 - 30);
      ctx.font = '20px Arial';
      ctx.fillText('All coins collected!', canvas.width / 2, canvas.height / 2 + 10);
    } else {
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 30);
    }
    
    ctx.font = '18px Arial';
    ctx.fillText('Final Score: ' + score, canvas.width / 2, canvas.height / 2 + 40);
    ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 65);
    ctx.textAlign = 'left';
  }
}

// Game loop
function gameLoop() {
  update();
  render();
  
  // Update UI elements
  const scoreElement = document.getElementById('score');
  const healthElement = document.getElementById('health');
  const levelElement = document.getElementById('level');
  
  if (scoreElement) scoreElement.textContent = 'Score: ' + score;
  if (healthElement) healthElement.textContent = 'Health: 100';
  if (levelElement) levelElement.textContent = 'Level: 1';
  
  requestAnimationFrame(gameLoop);
}

// Game control functions
function startGame() {
  console.log('Starting game...');
  gameRunning = true;
  gameOver = false;
  score = 0;
  player.x = 50;
  player.y = 400;
  player.speedX = 0;
  player.speedY = 0;
  
  // Reset collectibles
  collectibles.forEach(c => c.collected = false);
}

function pauseGame() {
  console.log('Toggling pause...');
  gameRunning = !gameRunning;
}

function resetGame() {
  console.log('Resetting game...');
  gameRunning = false;
  gameOver = false;
  score = 0;
  player.x = 50;
  player.y = 400;
  player.speedX = 0;
  player.speedY = 0;
  
  // Reset collectibles
  collectibles.forEach(c => c.collected = false);
}

// Make functions globally available
window.startGame = startGame;
window.pauseGame = pauseGame;
window.resetGame = resetGame;

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !gameRunning && !gameOver) {
    startGame();
  }
  if (e.code === 'KeyR' && gameOver) {
    resetGame();
  }
  if (e.code === 'KeyP' && gameRunning) {
    pauseGame();
  }
});

// Start the game loop
console.log('Starting game loop...');
gameLoop();
`;
  }

  static escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  static generatePrototypeJS(prototypeData) {
    return `// ${prototypeData.gameName} - Generated Game Code
// Genre: ${prototypeData.genre}
// Generated by Prompt-to-Game Generator

${this.cleanPrototypeCode(prototypeData.gameCode)}

// Game data for reference
const GAME_DATA = ${JSON.stringify(prototypeData, null, 2)};`;
  }

  static generateCSS(prototypeData) {
    return `/* ${prototypeData.gameName} Styles */
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

.prototype-container {
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    padding: 30px;
    max-width: 900px;
    width: 100%;
}

#prototypeCanvas {
    border: 3px solid #667eea;
    border-radius: 10px;
    display: block;
    margin: 0 auto;
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.prototype-controls button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background: #667eea;
    color: white;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;
}

.prototype-controls button:hover {
    background: #5a6fd8;
    transform: translateY(-2px);
}`;
  }

  static generateReadme(prototypeData) {
    return `# ${prototypeData.gameName}

## Description
${prototypeData.description}

**Genre:** ${prototypeData.genre}
**Theme:** ${prototypeData.theme}

## How to Play
${prototypeData.rules}

## Controls
- **Movement:** ${prototypeData.controls?.movement || 'Arrow keys'}
- **Action:** ${prototypeData.controls?.action || 'Spacebar'}
- **Special:** ${prototypeData.controls?.special || 'R to restart'}

## Installation
1. Download all files to a folder
2. Open \`index.html\` in a web browser
3. Click "Start Game" to play!

## Generated by
Prompt-to-Game Generator - Powered by Together AI
Generated on: ${new Date().toLocaleDateString()}
`;
  }
}