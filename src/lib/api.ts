
import { supabase, isSupabaseConfigured } from './supabase';

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
    const { data: userCourses, error } = await supabase
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
    const { data: achievements, error } = await supabase
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
  } catch (error) {
    console.error('Exception in getUserActivities:', error);
    return mockUserActivities;
  }
};
