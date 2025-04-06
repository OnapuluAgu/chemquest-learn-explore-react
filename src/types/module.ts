
export type ModuleType = 'theory' | 'lab' | 'quiz';

export interface Module {
  id: string;
  title: string;
  description: string;
  type: ModuleType;
  estimated_minutes: number;
  points: number;
  order_index: number;
  course_id: string;
  content: any;
}

export interface ModuleProgress {
  progress: number;
  completed: boolean;
}

export interface Course {
  id: string;
  title: string;
}
