
import { ProgressSummary } from "./ProgressSummary";
import { RecentAchievements } from "./RecentAchievements";
import { ContinueLearning } from "./ContinueLearning";

interface CourseProgress {
  id: string;
  title: string;
  progress: number;
}

interface Achievement {
  title: string;
  description: string;
  icon: React.ReactNode;
  achieved: boolean;
  achievedDate?: Date;
}

interface CourseItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  nextModule: string;
  modules: {
    completed: number;
    total: number;
  };
  lastAccessed: string;
  nextModuleId: string | null;
}

interface DashboardOverviewProps {
  courses: CourseItem[];
  achievements: Achievement[];
  onContinueLearning: (courseId: string, nextModuleId: string | null) => void;
}

export const DashboardOverview = ({ 
  courses, 
  achievements, 
  onContinueLearning 
}: DashboardOverviewProps) => {
  const courseProgress = courses.map(course => ({
    id: course.id,
    title: course.title,
    progress: course.progress
  }));
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ProgressSummary courses={courseProgress} />
      <RecentAchievements achievements={achievements} />
      <ContinueLearning 
        courses={courses} 
        onContinueLearning={onContinueLearning} 
      />
    </div>
  );
};
