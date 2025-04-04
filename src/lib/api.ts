
import { supabase, isSupabaseConfigured } from './supabase';
import { Database } from '@/integrations/supabase/types';

// Types for our data
export type UserCourse = {
  id: string;
  title: string;
  progress: number;
  last_accessed: string;
  modules_completed: number;
  modules_total: number;
  next_module: string;
  course_icon: string;
  color_class: string;
};

export type UserAchievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  achieved: boolean;
  achieved_date?: string;
};

export type UserActivity = {
  id: string;
  description: string;
  created_at: string;
};

// New types for our database schema
export type Course = {
  id: string;
  title: string;
  description: string;
  level: string;
  icon: string;
  color_class: string;
  thumbnail_url: string | null;
  total_modules: number;
  estimated_hours: number;
  created_at: string | null;
  updated_at: string | null;
};

export type Module = {
  id: string;
  course_id: string;
  title: string;
  description: string;
  order_index: number;
  type: 'theory' | 'lab' | 'quiz';
  content: any;
  estimated_minutes: number;
  points: number;
  created_at: string | null;
  updated_at: string | null;
};

export type UserModuleProgress = {
  id: string;
  user_id: string;
  module_id: string;
  progress: number | null;
  completed: boolean | null;
  score: number | null;
  last_accessed: string | null;
  created_at: string | null;
  updated_at: string | null;
};

// Mock data for when Supabase is not configured or user is not logged in
const mockUserCourses: UserCourse[] = [
  {
    id: "CQ101",
    title: "CQ101: Foundations of Chemistry",
    progress: 0,
    last_accessed: new Date().toISOString(),
    modules_completed: 0,
    modules_total: 5,
    next_module: "Introduction to Chemistry",
    course_icon: "atom",
    color_class: "bg-chemistry-soft-purple text-chemistry-purple",
  }
];

const mockUserAchievements: UserAchievement[] = [
  { 
    id: "A1", 
    title: "Quick Learner", 
    description: "Complete 5 modules in under a week", 
    icon: "clock", 
    achieved: false 
  },
  { 
    id: "A2", 
    title: "Chemistry Novice", 
    description: "Earn 75% or higher on 3 quizzes", 
    icon: "trophy", 
    achieved: false 
  }
];

const mockUserActivities: UserActivity[] = [
  { 
    id: "ACT1", 
    description: "Start your chemistry journey by enrolling in a course", 
    created_at: new Date().toISOString() 
  }
];

// Helper function to check if user is authenticated
const isUserAuthenticated = () => {
  return supabase.auth.getSession().then(({ data }) => !!data.session);
};

// User courses
export const getUserCourses = async () => {
  // If Supabase is not configured, return mock data
  if (!isSupabaseConfigured) {
    console.log('Using mock course data (Supabase not configured)');
    return mockUserCourses;
  }

  // Check if user is authenticated
  const isAuthenticated = await isUserAuthenticated();
  if (!isAuthenticated) {
    console.log('Using mock course data (User not authenticated)');
    return mockUserCourses;
  }

  try {
    // Use type assertion to work around TypeScript constraints
    const { data: userCourses, error } = await (supabase as any)
      .from('user_courses')
      .select('*')
      .order('last_accessed', { ascending: false });

    if (error) {
      console.error('Error fetching user courses:', error);
      throw error;
    }

    return userCourses as UserCourse[];
  } catch (error) {
    console.error('Exception in getUserCourses:', error);
    return mockUserCourses;
  }
};

// User achievements
export const getUserAchievements = async () => {
  // If Supabase is not configured, return mock data
  if (!isSupabaseConfigured) {
    console.log('Using mock achievement data (Supabase not configured)');
    return mockUserAchievements;
  }

  // Check if user is authenticated
  const isAuthenticated = await isUserAuthenticated();
  if (!isAuthenticated) {
    console.log('Using mock achievement data (User not authenticated)');
    return mockUserAchievements;
  }

  try {
    // Use type assertion to work around TypeScript constraints
    const { data: achievements, error } = await (supabase as any)
      .from('user_achievements')
      .select('*')
      .order('achieved', { ascending: false });

    if (error) {
      console.error('Error fetching user achievements:', error);
      throw error;
    }

    return achievements as UserAchievement[];
  } catch (error) {
    console.error('Exception in getUserAchievements:', error);
    return mockUserAchievements;
  }
};

// User activities
export const getUserActivities = async () => {
  // If Supabase is not configured, return mock data
  if (!isSupabaseConfigured) {
    console.log('Using mock activity data (Supabase not configured)');
    return mockUserActivities;
  }

  // Check if user is authenticated
  const isAuthenticated = await isUserAuthenticated();
  if (!isAuthenticated) {
    console.log('Using mock activity data (User not authenticated)');
    return mockUserActivities;
  }

  try {
    // Use type assertion to work around TypeScript constraints
    const { data: activities, error } = await (supabase as any)
      .from('user_activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching user activities:', error);
      throw error;
    }

    return activities as UserActivity[];
  } catch (error) {
    console.error('Exception in getUserActivities:', error);
    return mockUserActivities;
  }
};

// New functions to fetch data from our new tables
export const getCourses = async () => {
  try {
    // Using proper typings with the "from" method
    const { data, error } = await supabase
      .from('courses')
      .select();

    if (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }

    return data as Course[];
  } catch (error) {
    console.error('Exception in getCourses:', error);
    return [];
  }
};

export const getCourseById = async (courseId: string) => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select()
      .eq('id', courseId)
      .single();

    if (error) {
      console.error(`Error fetching course ${courseId}:`, error);
      throw error;
    }

    return data as Course;
  } catch (error) {
    console.error(`Exception in getCourseById for ${courseId}:`, error);
    return null;
  }
};

export const getModulesByCourseId = async (courseId: string) => {
  try {
    const { data, error } = await supabase
      .from('modules')
      .select()
      .eq('course_id', courseId)
      .order('order_index');

    if (error) {
      console.error(`Error fetching modules for course ${courseId}:`, error);
      throw error;
    }

    return data as Module[];
  } catch (error) {
    console.error(`Exception in getModulesByCourseId for ${courseId}:`, error);
    return [];
  }
};

export const getModuleById = async (moduleId: string) => {
  try {
    const { data, error } = await supabase
      .from('modules')
      .select()
      .eq('id', moduleId)
      .single();

    if (error) {
      console.error(`Error fetching module ${moduleId}:`, error);
      throw error;
    }

    return data as Module;
  } catch (error) {
    console.error(`Exception in getModuleById for ${moduleId}:`, error);
    return null;
  }
};

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
    
    // Check if a record exists
    const { data: existingRecord } = await supabase
      .from('user_module_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .maybeSingle();

    if (existingRecord) {
      // Update existing record
      const { data, error } = await supabase
        .from('user_module_progress')
        .update({
          progress,
          completed,
          score: score !== null ? score : undefined,
          last_accessed: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', existingRecord.id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating progress for module ${moduleId}:`, error);
        throw error;
      }

      return data as UserModuleProgress;
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('user_module_progress')
        .insert({
          user_id: userId,
          module_id: moduleId,
          progress,
          completed,
          score,
          last_accessed: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error(`Error creating progress for module ${moduleId}:`, error);
        throw error;
      }

      return data as UserModuleProgress;
    }
  } catch (error) {
    console.error(`Exception in updateUserModuleProgress for ${moduleId}:`, error);
    return null;
  }
};
