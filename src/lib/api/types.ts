
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
