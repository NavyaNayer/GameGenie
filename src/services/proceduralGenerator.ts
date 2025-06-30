// ProceduralGenerator.ts
// This file provides procedural (algorithmic) generation of game levels for different genres.
// It supports dungeon, platformer, maze, and open-world level generation, using random algorithms and optional AI for creative content.
// Each method below generates a different type of level structure, returning a data object describing the generated map, enemies, items, etc.

import { LlamaService } from './llamaService';

export class ProceduralGenerator {
  // Cache for AI-generated enemy lists
  private static llamaEnemiesCache: { [key: string]: string[] } = {};

  /**
   * Main entry: Generate a level of the given type (dungeon, platformer, maze, open-world)
   * Returns a data object describing the generated level structure.
   */
  static generateLevel(params: {
    width: number;
    height: number;
    type: 'dungeon' | 'platformer' | 'maze' | 'open-world';
    difficulty: number;
    theme: string;
  }) {
    switch (params.type) {
      case 'dungeon':
        return this.generateDungeon(params);
      case 'platformer':
        return this.generatePlatformer(params);
      case 'maze':
        return this.generateMaze(params);
      case 'open-world':
        return this.generateOpenWorld(params);
      default:
        return this.generateDungeon(params);
    }
  }

  /**
   * Main entry: Generate a level with an AI prompt (for creative enemy names, etc.)
   * Only dungeon supports prompt-based AI enemies for now.
   */
  static async generateLevelWithPrompt(params: {
    width: number;
    height: number;
    type: 'dungeon' | 'platformer' | 'maze' | 'open-world';
    difficulty: number;
    theme: string;
    prompt: string;
  }) {
    switch (params.type) {
      case 'dungeon':
        return await this.generateDungeonWithPrompt(params);
      // You can add similar logic for other types if needed
      default:
        return await this.generateDungeonWithPrompt(params);
    }
  }

  // Helper: Get a list of creative enemy names from Llama AI, with caching
  private static async getPromptEnemy(theme: string, prompt: string, n = 5): Promise<string[]> {
    const cacheKey = `${theme}|${prompt}`;
    if (this.llamaEnemiesCache[cacheKey]) return this.llamaEnemiesCache[cacheKey];
    const list = await LlamaService.generateList(`Generate ${n} creative enemies for a ${theme} prototype. Prompt: ${prompt}`, n);
    this.llamaEnemiesCache[cacheKey] = list;
    return list;
  }

  /**
   * Dungeon Generation:
   * - Creates a grid with random rooms and corridors connecting them.
   * - Populates rooms with random enemies and items based on theme and difficulty.
   * - Returns the grid, rooms, enemies, items, player start, and exit positions.
   */
  private static generateDungeon(params: any) {
    const { width, height, difficulty, theme } = params;
    const grid = Array(height).fill(null).map(() => Array(width).fill(0));
    
    // Generate rooms
    const rooms = [];
    const numRooms = Math.floor(difficulty * 3) + 5;
    
    for (let i = 0; i < numRooms; i++) {
      const roomWidth = Math.floor(Math.random() * 8) + 4;
      const roomHeight = Math.floor(Math.random() * 6) + 3;
      const x = Math.floor(Math.random() * (width - roomWidth - 2)) + 1;
      const y = Math.floor(Math.random() * (height - roomHeight - 2)) + 1;
      
      rooms.push({ x, y, width: roomWidth, height: roomHeight });
      
      // Carve out room
      for (let ry = y; ry < y + roomHeight; ry++) {
        for (let rx = x; rx < x + roomWidth; rx++) {
          grid[ry][rx] = 1; // Floor
        }
      }
    }
    
    // Generate corridors
    for (let i = 0; i < rooms.length - 1; i++) {
      const room1 = rooms[i];
      const room2 = rooms[i + 1];
      
      const x1 = room1.x + Math.floor(room1.width / 2);
      const y1 = room1.y + Math.floor(room1.height / 2);
      const x2 = room2.x + Math.floor(room2.width / 2);
      const y2 = room2.y + Math.floor(room2.height / 2);
      
      // Horizontal corridor
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      for (let x = minX; x <= maxX; x++) {
        grid[y1][x] = 1;
      }
      
      // Vertical corridor
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      for (let y = minY; y <= maxY; y++) {
        grid[y][x2] = 1;
      }
    }
    
    // Add enemies and items
    const enemies = [];
    const items = [];
    const numEnemies = Math.floor(difficulty * 2) + 3;
    const numItems = Math.floor(difficulty * 1.5) + 2;
    
    for (let i = 0; i < numEnemies; i++) {
      const room = rooms[Math.floor(Math.random() * rooms.length)];
      enemies.push({
        x: room.x + Math.floor(Math.random() * room.width),
        y: room.y + Math.floor(Math.random() * room.height),
        type: this.getRandomEnemy(theme, difficulty)
      });
    }
    
    for (let i = 0; i < numItems; i++) {
      const room = rooms[Math.floor(Math.random() * rooms.length)];
      items.push({
        x: room.x + Math.floor(Math.random() * room.width),
        y: room.y + Math.floor(Math.random() * room.height),
        type: this.getRandomItem(theme, difficulty)
      });
    }
    
    return {
      grid,
      rooms,
      enemies,
      items,
      playerStart: { x: rooms[0].x + 1, y: rooms[0].y + 1 },
      exit: { 
        x: rooms[rooms.length - 1].x + rooms[rooms.length - 1].width - 2, 
        y: rooms[rooms.length - 1].y + rooms[rooms.length - 1].height - 2 
      }
    };
  }

  /**
   * Dungeon Generation with AI prompt:
   * - Same as above, but uses Llama AI to generate creative enemy names based on the prompt.
   */
  private static async generateDungeonWithPrompt(params: any) {
    const { width, height, difficulty, theme, prompt } = params;
    const grid = Array(height).fill(null).map(() => Array(width).fill(0));
    const rooms = [];
    const numRooms = Math.floor(difficulty * 3) + 5;
    for (let i = 0; i < numRooms; i++) {
      const roomWidth = Math.floor(Math.random() * 8) + 4;
      const roomHeight = Math.floor(Math.random() * 6) + 3;
      const x = Math.floor(Math.random() * (width - roomWidth - 2)) + 1;
      const y = Math.floor(Math.random() * (height - roomHeight - 2)) + 1;
      rooms.push({ x, y, width: roomWidth, height: roomHeight });
      for (let ry = y; ry < y + roomHeight; ry++) {
        for (let rx = x; rx < x + roomWidth; rx++) {
          grid[ry][rx] = 1;
        }
      }
    }
    for (let i = 0; i < rooms.length - 1; i++) {
      const room1 = rooms[i];
      const room2 = rooms[i + 1];
      const x1 = room1.x + Math.floor(room1.width / 2);
      const y1 = room1.y + Math.floor(room1.height / 2);
      const x2 = room2.x + Math.floor(room2.width / 2);
      const y2 = room2.y + Math.floor(room2.height / 2);
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      for (let x = minX; x <= maxX; x++) {
        grid[y1][x] = 1;
      }
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      for (let y = minY; y <= maxY; y++) {
        grid[y][x2] = 1;
      }
    }
    // AI-generated enemies
    const enemies = [];
    const numEnemies = Math.floor(difficulty * 2) + 3;
    const aiEnemies = await this.getPromptEnemy(theme, prompt, numEnemies);
    for (let i = 0; i < numEnemies; i++) {
      const room = rooms[Math.floor(Math.random() * rooms.length)];
      enemies.push({
        x: room.x + Math.floor(Math.random() * room.width),
        y: room.y + Math.floor(Math.random() * room.height),
        type: aiEnemies[i % aiEnemies.length] || 'enemy'
      });
    }
    // Items (still hardcoded, can be made AI-driven similarly)
    const items = [];
    const numItems = Math.floor(difficulty * 1.5) + 2;
    for (let i = 0; i < numItems; i++) {
      const room = rooms[Math.floor(Math.random() * rooms.length)];
      items.push({
        x: room.x + Math.floor(Math.random() * room.width),
        y: room.y + Math.floor(Math.random() * room.height),
        type: this.getRandomItem(theme, difficulty)
      });
    }
    return {
      grid,
      rooms,
      enemies,
      items,
      playerStart: { x: rooms[0].x + 1, y: rooms[0].y + 1 },
      exit: {
        x: rooms[rooms.length - 1].x + rooms[rooms.length - 1].width - 2,
        y: rooms[rooms.length - 1].y + rooms[rooms.length - 1].height - 2
      }
    };
  }

  /**
   * Platformer Generation:
   * - Creates a grid with ground, platforms, gaps, and hazards.
   * - Adds collectibles and enemies on platforms.
   * - Returns the grid, player start, exit, collectibles, and enemies.
   */
  private static generatePlatformer(params: any) {
    const { width, height, difficulty, theme } = params;
    const grid = Array(height).fill(null).map(() => Array(width).fill(0));
    
    // Generate ground
    const groundHeight = Math.floor(height * 0.8);
    for (let x = 0; x < width; x++) {
      for (let y = groundHeight; y < height; y++) {
        grid[y][x] = 1; // Ground
      }
    }
    
    // Generate platforms
    const numPlatforms = Math.floor(difficulty * 4) + 6;
    for (let i = 0; i < numPlatforms; i++) {
      const platformWidth = Math.floor(Math.random() * 6) + 3;
      const x = Math.floor(Math.random() * (width - platformWidth));
      const y = Math.floor(Math.random() * (groundHeight - 5)) + 2;
      
      for (let px = x; px < x + platformWidth; px++) {
        grid[y][px] = 1; // Platform
      }
    }
    
    // Add gaps and hazards
    const numGaps = Math.floor(difficulty * 2) + 1;
    for (let i = 0; i < numGaps; i++) {
      const gapWidth = Math.floor(Math.random() * 4) + 2;
      const x = Math.floor(Math.random() * (width - gapWidth));
      
      for (let gx = x; gx < x + gapWidth; gx++) {
        for (let y = groundHeight; y < height; y++) {
          grid[y][gx] = 3; // Hazard/gap
        }
      }
    }
    
    return {
      grid,
      playerStart: { x: 2, y: groundHeight - 1 },
      exit: { x: width - 3, y: groundHeight - 1 },
      collectibles: this.generateCollectibles(width, height, grid, difficulty),
      enemies: this.generatePlatformerEnemies(width, height, grid, difficulty, theme)
    };
  }

  /**
   * Maze Generation:
   * - Uses recursive backtracking to carve a maze from a grid of walls.
   * - Returns the grid, player start, and exit positions.
   */
  private static generateMaze(params: any) {
    const { width, height } = params;
    const grid = Array(height).fill(null).map(() => Array(width).fill(1)); // Start with walls
    
    // Recursive backtracking maze generation
    const stack = [];
    const visited = Array(height).fill(null).map(() => Array(width).fill(false));
    
    const startX = 1;
    const startY = 1;
    grid[startY][startX] = 0; // Path
    visited[startY][startX] = true;
    stack.push([startX, startY]);
    
    const directions = [[0, 2], [2, 0], [0, -2], [-2, 0]];
    
    while (stack.length > 0) {
      const [x, y] = stack[stack.length - 1];
      const neighbors = [];
      
      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        
        if (nx > 0 && nx < width - 1 && ny > 0 && ny < height - 1 && !visited[ny][nx]) {
          neighbors.push([nx, ny]);
        }
      }
      
      if (neighbors.length > 0) {
        const [nx, ny] = neighbors[Math.floor(Math.random() * neighbors.length)];
        grid[ny][nx] = 0; // Path
        grid[y + (ny - y) / 2][x + (nx - x) / 2] = 0; // Remove wall between
        visited[ny][nx] = true;
        stack.push([nx, ny]);
      } else {
        stack.pop();
      }
    }
    
    return {
      grid,
      playerStart: { x: 1, y: 1 },
      exit: { x: width - 2, y: height - 2 }
    };
  }

  /**
   * Open World Generation:
   * - Simulates terrain using a simple noise function for hills, water, and plains.
   * - Adds random points of interest (villages, dungeons, etc.).
   * - Returns the grid, points of interest, and player start position.
   */
  private static generateOpenWorld(params: any) {
    const { width, height, difficulty, theme } = params;
    const grid = Array(height).fill(null).map(() => Array(width).fill(0));
    
    // Generate terrain using Perlin noise simulation
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const noise = this.simpleNoise(x * 0.1, y * 0.1);
        
        if (noise > 0.3) {
          grid[y][x] = 1; // Hills/mountains
        } else if (noise < -0.2) {
          grid[y][x] = 2; // Water
        } else {
          grid[y][x] = 0; // Plains
        }
      }
    }
    
    // Add points of interest
    const poi = [];
    const numPOI = Math.floor(difficulty * 2) + 3;
    
    for (let i = 0; i < numPOI; i++) {
      poi.push({
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
        type: ['village', 'dungeon', 'treasure', 'boss'][Math.floor(Math.random() * 4)]
      });
    }
    
    return {
      grid,
      pointsOfInterest: poi,
      playerStart: { x: Math.floor(width / 2), y: Math.floor(height / 2) }
    };
  }

  private static simpleNoise(x: number, y: number): number {
    return Math.sin(x) * Math.cos(y) + Math.sin(x * 2) * Math.cos(y * 2) * 0.5;
  }

  private static getRandomEnemy(theme: string, difficulty: number): string {
    const enemies: { [key: string]: string[] } = {
      fantasy: ['goblin', 'orc', 'skeleton', 'dragon', 'wizard'],
      'sci-fi': ['robot', 'alien', 'cyborg', 'drone', 'mutant'],
      horror: ['zombie', 'ghost', 'demon', 'vampire', 'werewolf'],
      medieval: ['knight', 'archer', 'bandit', 'guard', 'assassin']
    };
    const themeEnemies = enemies[theme] || enemies.fantasy;
    return themeEnemies[Math.floor(Math.random() * themeEnemies.length)];
  }

  private static getRandomItem(theme: string, difficulty: number): string {
    const items = {
      fantasy: ['sword', 'shield', 'potion', 'scroll', 'gem'],
      'sci-fi': ['laser', 'armor', 'energy cell', 'scanner', 'chip'],
      horror: ['cross', 'garlic', 'silver bullet', 'holy water', 'amulet'],
      medieval: ['blade', 'chainmail', 'bow', 'arrow', 'gold']
    };
    
    const themeItems = items[theme as keyof typeof items] || items.fantasy;
    return themeItems[Math.floor(Math.random() * themeItems.length)];
  }

  private static generateCollectibles(width: number, height: number, grid: any[][], difficulty: number) {
    const collectibles = [];
    const numCollectibles = Math.floor(difficulty * 3) + 5;
    
    for (let i = 0; i < numCollectibles; i++) {
      let x, y;
      do {
        x = Math.floor(Math.random() * width);
        y = Math.floor(Math.random() * height);
      } while (grid[y][x] !== 0); // Find empty space
      
      collectibles.push({ x, y, type: 'coin' });
    }
    
    return collectibles;
  }

  private static generatePlatformerEnemies(width: number, height: number, grid: any[][], difficulty: number, theme: string) {
    const enemies = [];
    const numEnemies = Math.floor(difficulty * 2) + 2;
    
    for (let i = 0; i < numEnemies; i++) {
      let x, y;
      do {
        x = Math.floor(Math.random() * width);
        y = Math.floor(Math.random() * height);
      } while (grid[y][x] !== 0 || (y < height - 1 && grid[y + 1][x] === 0)); // Find platform
      
      enemies.push({ 
        x, 
        y, 
        type: this.getRandomEnemy(theme, difficulty),
        direction: Math.random() > 0.5 ? 1 : -1
      });
    }
    
    return enemies;
  }
}