
import { supabase } from './supabase';

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

// User courses
export const getUserCourses = async () => {
  const { data: userCourses, error } = await supabase
    .from('user_courses')
    .select('*')
    .order('last_accessed', { ascending: false });

  if (error) {
    console.error('Error fetching user courses:', error);
    throw error;
  }

  return userCourses as UserCourse[];
};

// User achievements
export const getUserAchievements = async () => {
  const { data: achievements, error } = await supabase
    .from('user_achievements')
    .select('*')
    .order('achieved', { ascending: false });

  if (error) {
    console.error('Error fetching user achievements:', error);
    throw error;
  }

  return achievements as UserAchievement[];
};

// User activities
export const getUserActivities = async () => {
  const { data: activities, error } = await supabase
    .from('user_activities')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching user activities:', error);
    throw error;
  }

  return activities as UserActivity[];
};
