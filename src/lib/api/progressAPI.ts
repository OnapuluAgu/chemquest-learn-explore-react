
import { supabase } from '../supabase';
import { UserModuleProgress } from './types';

// Function to get a user's progress for a specific module
export const getUserModuleProgress = async (moduleId: string) => {
  try {
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      return null;
    }

    const userId = session.data.session.user.id;
    
    const { data, error } = await supabase
      .from('user_module_progress')
      .select()
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching user progress for module ${moduleId}:`, error);
      throw error;
    }

    return data as UserModuleProgress | null;
  } catch (error) {
    console.error(`Exception in getUserModuleProgress for ${moduleId}:`, error);
    return null;
  }
};

// Function to update a user's progress for a specific module
export const updateUserModuleProgress = async (
  moduleId: string, 
  progress: number, 
  completed: boolean = false, 
  score: number | null = null
) => {
  try {
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      console.error('Cannot update progress: No authenticated user');
      return null;
    }

    const userId = session.data.session.user.id;
    
    console.log(`Updating progress for module ${moduleId}: ${progress}%, completed: ${completed}`);
    
    // Check if a record exists
    const { data: existingRecord } = await supabase
      .from('user_module_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .maybeSingle();

    if (existingRecord) {
      // Update existing record
      const updateData = {
        progress,
        completed,
        score: score !== null ? score : undefined,
        last_accessed: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('user_module_progress')
        .update(updateData)
        .eq('id', existingRecord.id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating progress for module ${moduleId}:`, error);
        throw error;
      }

      console.log(`Progress updated successfully for module ${moduleId}`);
      return data as UserModuleProgress;
    } else {
      // Insert new record
      const insertData = {
        user_id: userId,
        module_id: moduleId,
        progress,
        completed,
        score,
        last_accessed: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('user_module_progress')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error(`Error creating progress for module ${moduleId}:`, error);
        throw error;
      }

      console.log(`New progress record created for module ${moduleId}`);
      return data as UserModuleProgress;
    }
  } catch (error) {
    console.error(`Exception in updateUserModuleProgress for ${moduleId}:`, error);
    return null;
  }
};
