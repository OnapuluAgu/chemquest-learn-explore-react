
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, BeakerIcon, GraduationCapIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { getModuleById, getCourseById, getModulesByCourseId } from "@/lib/api";
import { Layout } from "@/components/Layout";
import { ModuleHeader } from "@/components/module/ModuleHeader";
import { ModuleProgress } from "@/components/module/ModuleProgress";
import { ModuleFooter } from "@/components/module/ModuleFooter";
import { ModuleTheoryContent } from "@/components/module/ModuleTheoryContent";
import { ModuleLabContent } from "@/components/module/ModuleLabContent";
import { ModuleQuizContent } from "@/components/module/ModuleQuizContent";
import { ModuleLoading } from "@/components/module/ModuleLoading";
import { ModuleNotFound } from "@/components/module/ModuleNotFound";
import { useModuleContent } from "@/hooks/useModuleContent";
import { ModuleType } from "@/types/module";

const ModuleDetailPage = () => {
  const { courseId, moduleId } = useParams<{ courseId: string; moduleId: string }>();
  const [nextModuleId, setNextModuleId] = useState<string | null>(null);
  
  if (!moduleId) {
    return <ModuleNotFound />;
  }

  const { 
    data: module, 
    isLoading: isLoadingModule 
  } = useQuery({
    queryKey: ['module', moduleId],
    queryFn: () => getModuleById(moduleId),
    enabled: !!moduleId
  });

  const { 
    data: course, 
    isLoading: isLoadingCourse 
  } = useQuery({
    queryKey: ['course', module?.course_id || courseId],
    queryFn: () => getCourseById(module?.course_id || courseId || ''),
    enabled: !!(module?.course_id || courseId)
  });

  const {
    data: allModules = [],
    isLoading: isLoadingAllModules
  } = useQuery({
    queryKey: ['course-modules', module?.course_id || courseId],
    queryFn: () => getModulesByCourseId(module?.course_id || courseId || ''),
    enabled: !!(module?.course_id || courseId)
  });

  const {
    timeRemaining,
    formatTime,
    currentProgress,
    isCompleted,
    hasAttemptedExercise,
    markExerciseAttempted,
    navigateToInteractive,
    handleQuizOptionClick,
    handleLabComplete,
    handleQuizComplete,
    handleCompleteModule,
    navigateToNextModule,
    navigateToCourse,
    updateProgress,
    isLoadingProgress
  } = useModuleContent(moduleId, module, module?.course_id || courseId || '');
  
  // Find the next module in sequence
  useEffect(() => {
    if (allModules.length > 0 && moduleId) {
      const sortedModules = [...allModules].sort((a, b) => a.order_index - b.order_index);
      
      const currentIndex = sortedModules.findIndex(m => m.id === moduleId);
      
      if (currentIndex >= 0 && currentIndex < sortedModules.length - 1) {
        setNextModuleId(sortedModules[currentIndex + 1].id);
      } else {
        setNextModuleId(null);
      }
    }
  }, [allModules, moduleId]);

  // Set initial progress when first loading the module
  useEffect(() => {
    if (module && currentProgress === 0 && !isCompleted) {
      const initialProgress = 10;
      updateProgress(initialProgress);
    }
  }, [module, currentProgress, isCompleted, updateProgress]);

  const renderModuleIcon = () => {
    switch (module?.type as ModuleType) {
      case 'lab':
        return <BeakerIcon className="h-5 w-5" />;
      case 'quiz':
        return <GraduationCapIcon className="h-5 w-5" />;
      case 'theory':
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const renderModuleContent = () => {
    if (!module) return null;

    switch (module.type) {
      case 'theory': {
        const sections = module.content.sections || [];
        return (
          <ModuleTheoryContent
            sections={sections}
            quiz={module.content.quiz}
            navigateToInteractive={navigateToInteractive}
            markExerciseAttempted={markExerciseAttempted}
            handleQuizOptionClick={handleQuizOptionClick}
          />
        );
      }
      
      case 'lab': {
        const lab = module.content;
        return (
          <ModuleLabContent
            introduction={lab.introduction}
            experiment={lab.experiment}
            real_life_connection={lab.real_life_connection}
            handleLabComplete={handleLabComplete}
          />
        );
      }
      
      case 'quiz': {
        const quiz = module.content;
        return (
          <ModuleQuizContent
            introduction={quiz.introduction}
            questions={quiz.questions}
            handleQuizOptionClick={(question, optionIndex) => handleQuizOptionClick(question, optionIndex)}
            handleQuizComplete={handleQuizComplete}
          />
        );
      }
      
      default:
        return <div>Unsupported module type</div>;
    }
  };

  const actualCourseId = course?.id || module?.course_id || courseId || '';

  if (isLoadingModule || isLoadingCourse || isLoadingProgress || isLoadingAllModules) {
    return <ModuleLoading />;
  }

  if (!module) {
    return <ModuleNotFound />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <ModuleHeader
          moduleTitle={module.title}
          moduleDescription={module.description}
          moduleType={module.type as ModuleType}
          courseTitle={course?.title || 'Course'}
          courseId={actualCourseId}
          moduleOrderIndex={module.order_index}
          estimatedMinutes={module.estimated_minutes}
          points={module.points}
          timeRemaining={timeRemaining}
          renderModuleIcon={renderModuleIcon}
          formatTime={formatTime}
        />

        <ModuleProgress currentProgress={currentProgress} />

        <Separator className="mb-8" />
        
        {renderModuleContent()}

        <ModuleFooter
          actualCourseId={actualCourseId}
          isCompleted={isCompleted}
          nextModuleId={nextModuleId}
          hasAttemptedExercise={hasAttemptedExercise}
          handleCompleteModule={handleCompleteModule}
          navigateToNextModule={navigateToNextModule}
          navigateToCourse={navigateToCourse}
        />
      </div>
    </Layout>
  );
};

export default ModuleDetailPage;
