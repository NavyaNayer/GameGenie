import { createClient } from '@supabase/supabase-js';
import { API_CONFIG } from '../config/apiKeys';

const supabase = createClient(API_CONFIG.SUPABASE.url, API_CONFIG.SUPABASE.anonKey);

export class CollaborationService {
  static async createProject(gameData: any, userId: string) {
    try {
      const { data, error } = await supabase
        .from('game_projects')
        .insert([
          {
            name: gameData.gameName,
            data: gameData,
            owner_id: userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  }

  static async shareProject(projectId: string, email: string, permission: 'read' | 'write') {
    try {
      const { data, error } = await supabase
        .from('project_collaborators')
        .insert([
          {
            project_id: projectId,
            email: email,
            permission: permission,
            invited_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to share project:', error);
      throw error;
    }
  }

  static async getProjectCollaborators(projectId: string) {
    try {
      const { data, error } = await supabase
        .from('project_collaborators')
        .select('*')
        .eq('project_id', projectId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to get collaborators:', error);
      return [];
    }
  }

  static subscribeToProjectChanges(projectId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`project-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_projects',
          filter: `id=eq.${projectId}`
        },
        callback
      )
      .subscribe();
  }

  static async updateProject(projectId: string, gameData: any) {
    try {
      const { data, error } = await supabase
        .from('game_projects')
        .update({
          data: gameData,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  }
}