
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Separator } from "@/components/ui/separator";
import { getCourseById } from "@/lib/api";
import { CourseHeader } from "@/components/course/CourseHeader";
import { CourseSidebar } from "@/components/course/CourseSidebar";
import { CourseModulesList } from "@/components/course/CourseModulesList";
import { useCourseModules } from "@/hooks/useCourseModules";

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  if (!courseId) {
    return <div>Course ID is required</div>;
  }

  const { 
    data: course, 
    isLoading: isLoadingCourse,
    error: courseError
  } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourseById(courseId),
    enabled: !!courseId
  });

  const {
    modules: sortedModules,
    isLoadingModules,
    modulesError,
    moduleProgress,
    getModuleStatus,
    isModuleLocked,
    getFirstAvailableModule,
    calculateCourseProgress
  } = useCourseModules(courseId);

  // Show loading state
  if (isLoadingCourse || isLoadingModules) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12 flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-chemistry-purple"></div>
        </div>
      </Layout>
    );
  }

  // Show error state
  if (courseError || modulesError || !course) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <p className="mb-6">The course you're looking for doesn't exist or you don't have access to it.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <CourseHeader 
          course={course} 
          calculateCourseProgress={calculateCourseProgress} 
        />
        
        <div className="flex flex-col md:flex-row gap-6 mb-10">
          <CourseSidebar 
            course={course} 
            calculateCourseProgress={calculateCourseProgress}
            getFirstAvailableModule={getFirstAvailableModule}
            courseId={courseId}
          />
        </div>
        
        <Separator className="mb-8" />
        
        <CourseModulesList 
          modules={sortedModules}
          courseId={courseId}
          moduleProgress={moduleProgress}
          isModuleLocked={isModuleLocked}
          getModuleStatus={getModuleStatus}
        />
      </div>
    </Layout>
  );
};

export default CourseDetailPage;
