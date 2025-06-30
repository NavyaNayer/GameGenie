import { createClient } from '@supabase/supabase-js';
import { API_CONFIG } from '../config/apiKeys';

// Only create Supabase client if valid configuration is provided
let supabase: ReturnType<typeof createClient> | null = null;

const isValidSupabaseConfig = () => {
  return API_CONFIG.SUPABASE.url !== 'YOUR_SUPABASE_URL' && 
         API_CONFIG.SUPABASE.anonKey !== 'YOUR_SUPABASE_ANON_KEY' &&
         API_CONFIG.SUPABASE.url.startsWith('https://') &&
         API_CONFIG.SUPABASE.url.includes('.supabase.co');
};

if (isValidSupabaseConfig()) {
  supabase = createClient(API_CONFIG.SUPABASE.url, API_CONFIG.SUPABASE.anonKey);
}

export interface PlaytestEvent {
  gameId: string;
  eventType: 'start' | 'death' | 'level_complete' | 'item_collected' | 'enemy_defeated' | 'quit';
  timestamp: number;
  playerPosition?: { x: number; y: number };
  metadata?: Record<string, any>;
}

export class AnalyticsService {
  private static events: PlaytestEvent[] = [];

  static recordEvent(event: PlaytestEvent) {
    this.events.push(event);
    
    // Auto-save to database every 10 events (only if Supabase is configured)
    if (this.events.length >= 10) {
      this.saveEvents();
    }
  }

  static async saveEvents() {
    if (this.events.length === 0) return;

    // If Supabase is not configured, just clear events and return
    if (!supabase) {
      console.warn('Supabase not configured. Analytics events will not be saved to database.');
      this.events = [];
      return;
    }

    try {
      const { error } = await supabase
        .from('playtest_events')
        .insert(this.events);

      if (error) throw error;
      
      this.events = []; // Clear local events after saving
    } catch (error) {
      console.error('Failed to save analytics events:', error);
    }
  }

  static async getGameAnalytics(gameId: string) {
    // If Supabase is not configured, return default analytics
    if (!supabase) {
      console.warn('Supabase not configured. Returning default analytics.');
      return this.getDefaultAnalytics();
    }

    try {
      const { data, error } = await supabase
        .from('playtest_events')
        .select('*')
        .eq('gameId', gameId)
        .order('timestamp', { ascending: true });

      if (error) throw error;

      return this.processAnalytics(data || []);
    } catch (error) {
      console.error('Failed to get analytics:', error);
      return this.getDefaultAnalytics();
    }
  }

  private static processAnalytics(events: PlaytestEvent[]) {
    const totalSessions = new Set(events.map(e => e.timestamp)).size;
    const totalEvents = events.length;
    
    const eventCounts = events.reduce((acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const heatmapData = events
      .filter(e => e.playerPosition)
      .map(e => ({
        x: e.playerPosition!.x,
        y: e.playerPosition!.y,
        intensity: 1
      }));

    const timelineData = events.map(e => ({
      time: new Date(e.timestamp),
      event: e.eventType,
      count: 1
    }));

    return {
      totalSessions,
      totalEvents,
      eventCounts,
      heatmapData,
      timelineData,
      averageSessionLength: this.calculateAverageSessionLength(events),
      completionRate: this.calculateCompletionRate(events),
      mostCommonDeathLocation: this.findMostCommonDeathLocation(events)
    };
  }

  private static calculateAverageSessionLength(events: PlaytestEvent[]): number {
    const sessions = new Map<number, { start: number; end: number }>();
    
    events.forEach(event => {
      const sessionId = Math.floor(event.timestamp / 300000); // 5-minute sessions
      
      if (!sessions.has(sessionId)) {
        sessions.set(sessionId, { start: event.timestamp, end: event.timestamp });
      } else {
        const session = sessions.get(sessionId)!;
        session.end = Math.max(session.end, event.timestamp);
      }
    });

    const lengths = Array.from(sessions.values()).map(s => s.end - s.start);
    return lengths.reduce((sum, length) => sum + length, 0) / lengths.length / 1000; // Convert to seconds
  }

  private static calculateCompletionRate(events: PlaytestEvent[]): number {
    const starts = events.filter(e => e.eventType === 'start').length;
    const completions = events.filter(e => e.eventType === 'level_complete').length;
    
    return starts > 0 ? (completions / starts) * 100 : 0;
  }

  private static findMostCommonDeathLocation(events: PlaytestEvent[]): { x: number; y: number } | null {
    const deathEvents = events.filter(e => e.eventType === 'death' && e.playerPosition);
    
    if (deathEvents.length === 0) return null;

    const locationCounts = new Map<string, { count: number; x: number; y: number }>();
    
    deathEvents.forEach(event => {
      const key = `${event.playerPosition!.x},${event.playerPosition!.y}`;
      const existing = locationCounts.get(key);
      
      if (existing) {
        existing.count++;
      } else {
        locationCounts.set(key, {
          count: 1,
          x: event.playerPosition!.x,
          y: event.playerPosition!.y
        });
      }
    });

    let mostCommon = { count: 0, x: 0, y: 0 };
    locationCounts.forEach(location => {
      if (location.count > mostCommon.count) {
        mostCommon = location;
      }
    });

    return { x: mostCommon.x, y: mostCommon.y };
  }

  private static getDefaultAnalytics() {
    return {
      totalSessions: 0,
      totalEvents: 0,
      eventCounts: {},
      heatmapData: [],
      timelineData: [],
      averageSessionLength: 0,
      completionRate: 0,
      mostCommonDeathLocation: null
    };
  }

  // Inject analytics tracking into game code
  static injectAnalyticsCode(gameCode: string, gameId: string): string {
    const analyticsCode = `
// Analytics tracking
const GAME_ID = '${gameId}';
const recordEvent = (eventType, metadata = {}) => {
  const event = {
    gameId: GAME_ID,
    eventType,
    timestamp: Date.now(),
    playerPosition: gameState.player ? { x: gameState.player.x, y: gameState.player.y } : undefined,
    metadata
  };
  
  // Send to parent window for processing
  if (window.parent) {
    window.parent.postMessage({ type: 'analytics', event }, '*');
  }
};

// Track game start
recordEvent('start');

// Track game end on page unload
window.addEventListener('beforeunload', () => {
  recordEvent('quit');
});
`;

    // Insert analytics code at the beginning
    return analyticsCode + '\n\n' + gameCode;
  }
}