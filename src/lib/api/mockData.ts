
import { UserCourse, UserAchievement, UserActivity } from './types';

export const mockUserCourses: UserCourse[] = [
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

export const mockUserAchievements: UserAchievement[] = [
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

export const mockUserActivities: UserActivity[] = [
  { 
    id: "ACT1", 
    description: "Start your chemistry journey by enrolling in a course", 
    created_at: new Date().toISOString() 
  }
];
