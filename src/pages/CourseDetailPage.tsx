
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { ModuleCard } from "@/components/ModuleCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, AtomIcon, BeakerIcon, BookOpen } from "lucide-react";
import { getCourseById, getModulesByCourseId, getUserModuleProgress } from "@/lib/api";
import { useEffect, useState } from "react";

// Helper function to determine module status based on progress
const getModuleStatus = (progress: number | null, completed: boolean | null) => {
  if (completed) return "completed";
  if (progress && progress > 0) return "in-progress";
  return "not-started";
};

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [moduleProgress, setModuleProgress] = useState<Record<string, { progress: number, completed: boolean }>>({});
  
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
  
  // Sort modules by order_index
  const sortedModules = [...modules].sort((a, b) => a.order_index - b.order_index);

  // Load progress for each module
  useEffect(() => {
    const fetchAllModuleProgress = async () => {
      if (!sortedModules.length) return;
      
      // Create an object to store progress for all modules
      const progressData: Record<string, { progress: number, completed: boolean }> = {};
      
      // Fetch progress for each module sequentially
      for (const module of sortedModules) {
        try {
          const moduleProgressData = await getUserModuleProgress(module.id);
          if (moduleProgressData) {
            progressData[module.id] = {
              progress: moduleProgressData.progress || 0,
              completed: moduleProgressData.completed || false
            };
          } else {
            progressData[module.id] = { progress: 0, completed: false };
          }
        } catch (error) {
          console.error(`Error fetching progress for module ${module.id}:`, error);
          progressData[module.id] = { progress: 0, completed: false };
        }
      }
      
      setModuleProgress(progressData);
    };

    fetchAllModuleProgress();
  }, [sortedModules]);

  // Get course icon component
  const renderCourseIcon = () => {
    if (!course) return null;
    
    switch (course.icon) {
      case 'atom':
        return <AtomIcon className="h-7 w-7" />;
      case 'beaker':
        return <BeakerIcon className="h-7 w-7" />;
      case 'book':
        return <BookOpen className="h-7 w-7" />;
      default:
        return <AtomIcon className="h-7 w-7" />;
    }
  };

  // Determine if a module should be locked based on previous module's completion
  const isModuleLocked = (index: number) => {
    // First module is always unlocked
    if (index === 0) return false;
    
    // For subsequent modules, check if previous module is completed
    const previousModule = sortedModules[index - 1];
    if (!previousModule) return false;
    
    return !(moduleProgress[previousModule.id]?.completed);
  };

  // Find the first incomplete module for "Start Learning" button
  const getFirstAvailableModule = () => {
    for (let i = 0; i < sortedModules.length; i++) {
      const module = sortedModules[i];
      // If module is not locked and either not started or in progress
      if (!isModuleLocked(i) && !moduleProgress[module.id]?.completed) {
        return module.id;
      }
    }
    // If all modules are completed, return the first one
    return sortedModules[0]?.id;
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

  // Calculate overall course progress
  const calculateCourseProgress = () => {
    if (!sortedModules.length) return 0;
    
    let completedModules = 0;
    for (const module of sortedModules) {
      if (moduleProgress[module.id]?.completed) {
        completedModules++;
      }
    }
    
    return Math.round((completedModules / sortedModules.length) * 100);
  };

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
              <div className="flex items-center gap-1">
                <span className="font-medium">{calculateCourseProgress()}%</span> Complete
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
                <li className="flex justify-between">
                  <span className="text-gray-600">Progress:</span>
                  <span className="font-medium">{calculateCourseProgress()}%</span>
                </li>
              </ul>
              
              <Separator className="my-4" />
              
              <Button 
                asChild 
                className="w-full bg-chemistry-purple hover:bg-chemistry-blue"
                onClick={() => {
                  const moduleId = getFirstAvailableModule();
                  if (moduleId) {
                    navigate(`/course/${courseId}/module/${moduleId}`);
                  }
                }}
              >
                <Link to={`/course/${courseId}/module/${getFirstAvailableModule()}`}>
                  Continue Learning
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        <Separator className="mb-8" />
        
        <div>
          <h2 className="text-2xl font-semibold mb-6">Course Modules</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedModules.map((module, index) => {
              const moduleData = moduleProgress[module.id] || { progress: 0, completed: false };
              const locked = isModuleLocked(index);
              const status = locked 
                ? "not-started" 
                : getModuleStatus(moduleData.progress, moduleData.completed);
              
              return (
                <ModuleCard
                  key={module.id}
                  id={module.id}
                  title={module.title}
                  description={module.description}
                  progress={moduleData.progress || 0}
                  estimatedTime={`${module.estimated_minutes} min`}
                  status={status}
                  type={module.type}
                  locked={locked}
                  courseId={courseId}
                  orderIndex={module.order_index}
                />
              );
            })}
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
