
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardData } from "@/hooks/useDashboardData";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { CoursesList } from "@/components/dashboard/CoursesList";
import { AchievementsList } from "@/components/dashboard/AchievementsList";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";

const DashboardPage = () => {
  const navigate = useNavigate();
  
  const {
    courses,
    achievements,
    activities,
    isLoading
  } = useDashboardData();

  const handleContinueLearning = (courseId: string, nextModuleId: string | null) => {
    if (courseId && nextModuleId) {
      navigate(`/course/${courseId}/module/${nextModuleId}`);
    } else {
      navigate(`/course/${courseId}`);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12 flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-chemistry-purple"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>
        
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <DashboardOverview 
              courses={courses}
              achievements={achievements}
              onContinueLearning={handleContinueLearning}
            />
          </TabsContent>
          
          <TabsContent value="courses" className="space-y-4">
            <CoursesList courses={courses} />
          </TabsContent>
          
          <TabsContent value="achievements" id="achievements">
            <AchievementsList achievements={achievements} />
          </TabsContent>
          
          <TabsContent value="activity">
            <ActivityTimeline activities={activities} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DashboardPage;
