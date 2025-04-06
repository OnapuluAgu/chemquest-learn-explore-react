
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useModuleProgress } from "@/hooks/useModuleProgress";
import { Module } from "@/types/module";

export const useModuleContent = (
  moduleId: string,
  module: Module | undefined,
  courseId: string
) => {
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  
  const {
    currentProgress, 
    isCompleted,
    hasAttemptedExercise,
    markExerciseAttempted,
    updateProgress,
    isLoading: isLoadingProgress 
  } = useModuleProgress(moduleId);

  // Initialize timer based on module duration
  useEffect(() => {
    if (module && !timeRemaining) {
      const totalSeconds = (module.estimated_minutes || 30) * 60;
      setTimeRemaining(totalSeconds);
    }
  }, [module, timeRemaining]);

  // Countdown timer
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => (prev !== null && prev > 0) ? prev - 1 : 0);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeRemaining]);

  // Format time from seconds to MM:SS
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Navigate to interactive content
  const navigateToInteractive = (title: string, contentType: string) => {
    const urlTitle = title.toLowerCase().replace(/\s+/g, '-');
    
    const progressIncrement = 15;
    const newProgress = Math.min(currentProgress + progressIncrement, 100);
    updateProgress(newProgress);
    
    navigate(`/module-interactive/${urlTitle}?type=${contentType}&moduleId=${moduleId}`);
  };

  // Handle quiz option clicks
  const handleQuizOptionClick = (item: any, optionIndex: number) => {
    markExerciseAttempted();
    const progressIncrement = 20;
    const newProgress = Math.min(currentProgress + progressIncrement, 100);
    updateProgress(newProgress);
    
    if (optionIndex === item.correct_index) {
      toast({
        title: "Correct!",
        description: item.explanation,
        variant: "default",
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer is: ${item.options[item.correct_index]}. ${item.explanation}`,
        variant: "default",
      });
    }
  };

  // Handle lab completion
  const handleLabComplete = () => {
    markExerciseAttempted();
    const newProgress = Math.min(currentProgress + 50, 100);
    updateProgress(newProgress);
    
    toast({
      title: "Lab Experiment Completed",
      description: "Great job completing this virtual lab experiment!",
      variant: "default",
    });
  };

  // Handle quiz completion
  const handleQuizComplete = () => {
    markExerciseAttempted();
    updateProgress(100);
    
    toast({
      title: "Quiz Completed!",
      description: "Great job completing this quiz!",
      variant: "default",
    });
  };

  // Handle completing the module
  const handleCompleteModule = async () => {
    if (!hasAttemptedExercise) {
      toast({
        title: "Exercise Required",
        description: "Please attempt the module exercise before completing this module.",
        variant: "destructive",
      });
      return;
    }
    
    await updateProgress(100);
  };

  // Navigate to the next module
  const navigateToNextModule = (nextModuleId: string) => {
    toast({
      title: "Moving to next module",
      description: "The next module is now available.",
    });
    navigate(`/course/${courseId}/module/${nextModuleId}`);
  };

  // Navigate to course page
  const navigateToCourse = (courseId: string) => {
    toast({
      title: "Course Completed!",
      description: "You've completed all modules in this course.",
    });
    navigate(`/course/${courseId}`);
  };

  return {
    timeRemaining,
    formatTime,
    currentProgress,
    isCompleted,
    hasAttemptedExercise,
    markExerciseAttempted,
    updateProgress,
    navigateToInteractive,
    handleQuizOptionClick,
    handleLabComplete,
    handleQuizComplete,
    handleCompleteModule,
    navigateToNextModule,
    navigateToCourse,
    isLoadingProgress
  };
};
