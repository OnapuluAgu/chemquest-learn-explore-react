
import { supabase } from '../supabase';
import { shouldUseMockData } from './utils';
import { mockUserCourses, mockUserAchievements, mockUserActivities } from './mockData';
import { UserCourse, UserAchievement, UserActivity, Module } from './types';

// User courses - Modified to use courses table and transform data
export const getUserCourses = async () => {
  // Check if we should use mock data
  if (await shouldUseMockData()) {
    return mockUserCourses;
  }

  try {
    // Get the current user
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;

    // Get all courses
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*');

    if (coursesError) {
      console.error('Error fetching courses:', coursesError);
      throw coursesError;
    }

    // Get user's progress for all modules
    const { data: userProgress, error: progressError } = await supabase
      .from('user_module_progress')
      .select('*')
      .eq('user_id', userId);

    if (progressError) {
      console.error('Error fetching user progress:', progressError);
      throw progressError;
    }

    // Get all modules
    const { data: modules, error: modulesError } = await supabase
      .from('modules')
      .select('*');

    if (modulesError) {
      console.error('Error fetching modules:', modulesError);
      throw modulesError;
    }

    // Transform the data into UserCourse objects
    const userCourses: UserCourse[] = courses.map(course => {
      // Find modules for this course
      const courseModules = modules.filter(module => module.course_id === course.id);
      
      // Sort modules by order_index
      const sortedModules = [...courseModules].sort((a, b) => a.order_index - b.order_index);
      
      // Find user progress for modules in this course
      const courseProgress = userProgress.filter(progress => 
        courseModules.some(module => module.id === progress.module_id)
      );
      
      // Calculate completed modules
      const modulesCompleted = courseProgress.filter(progress => progress.completed).length;
      
      // Calculate overall progress percentage
      const progressPercentage = courseModules.length > 0
        ? Math.round((modulesCompleted / courseModules.length) * 100)
        : 0;
      
      // Find the next incomplete module
      let nextIncompleteModule = sortedModules
        .find(module => 
          !courseProgress.some(progress => 
            progress.module_id === module.id && progress.completed
          )
        );
      
      // If all modules are completed or no incomplete module found, use the first module
      if (!nextIncompleteModule && sortedModules.length > 0) {
        nextIncompleteModule = sortedModules[0];
      }
      
      // Find the most recently accessed module
      const lastAccessed = courseProgress.length > 0
        ? courseProgress.reduce((latest, current) => {
            if (!latest.last_accessed) return current;
            if (!current.last_accessed) return latest;
            return new Date(current.last_accessed) > new Date(latest.last_accessed)
              ? current
              : latest;
          }).last_accessed || new Date().toISOString()
        : new Date().toISOString();

      return {
        id: course.id,
        title: course.title,
        progress: progressPercentage,
        last_accessed: lastAccessed,
        modules_completed: modulesCompleted,
        modules_total: courseModules.length,
        next_module: nextIncompleteModule ? nextIncompleteModule.title : "Course Completed",
        course_icon: course.icon,
        color_class: course.color_class,
      };
    });

    return userCourses;
  } catch (error) {
    console.error('Exception in getUserCourses:', error);
    return mockUserCourses;
  }
};

// User achievements
export const getUserAchievements = async () => {
  // Check if we should use mock data
  if (await shouldUseMockData()) {
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
  // Check if we should use mock data
  if (await shouldUseMockData()) {
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
