
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { ModuleCard } from "@/components/ModuleCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, AtomIcon, Beaker, BookOpen } from "lucide-react";
import { getCourseById, getModulesByCourseId } from "@/lib/api";

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  
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
    data: modules = [],
    isLoading: isLoadingModules,
    error: modulesError
  } = useQuery({
    queryKey: ['course-modules', courseId],
    queryFn: () => getModulesByCourseId(courseId),
    enabled: !!courseId
  });

  // Get course icon component
  const renderCourseIcon = () => {
    if (!course) return null;
    
    switch (course.icon) {
      case 'atom':
        return <AtomIcon className="h-7 w-7" />;
      case 'beaker':
        return <Beaker className="h-7 w-7" />;
      case 'book':
        return <BookOpen className="h-7 w-7" />;
      default:
        return <AtomIcon className="h-7 w-7" />;
    }
  };

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
          <Button asChild variant="outline">
            <Link to="/courses">Browse Courses</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <Button asChild variant="outline" className="mb-6" size="sm">
          <Link to="/courses" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Courses
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row gap-6 mb-10">
          <div className="md:w-2/3">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-md ${course.color_class}`}>
                {renderCourseIcon()}
              </div>
              <div className="inline-flex px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                {course.level}
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
            <p className="text-gray-600 mb-6">{course.description}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <span className="font-medium">{course.total_modules}</span> Modules
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">{course.estimated_hours}</span> Hours
              </div>
            </div>
          </div>
          
          <div className="md:w-1/3">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Course Details</h3>
              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-medium">{course.level}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Modules:</span>
                  <span className="font-medium">{course.total_modules}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{course.estimated_hours} hours</span>
                </li>
              </ul>
              
              <Separator className="my-4" />
              
              <Button asChild className="w-full bg-chemistry-purple hover:bg-chemistry-blue">
                <Link to={`/course/${courseId}/module/${modules[0]?.id}`}>
                  Start Learning
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        <Separator className="mb-8" />
        
        <div>
          <h2 className="text-2xl font-semibold mb-6">Course Modules</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <ModuleCard
                key={module.id}
                id={module.id}
                title={module.title}
                description={module.description}
                progress={0} // This would come from user progress
                estimatedTime={`${module.estimated_minutes} min`}
                status="not-started" // This would come from user progress
                type={module.type}
              />
            ))}
          </div>
          
          {modules.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No modules available for this course.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CourseDetailPage;
