
import { useState, useEffect } from "react";
import { getUserModuleProgress, updateUserModuleProgress, getModulesByCourseId, getModuleById } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

export function useModuleProgress(moduleId: string) {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasAttemptedExercise, setHasAttemptedExercise] = useState(false);
  const queryClient = useQueryClient();
  
  // Fetch the initial progress
  const { data: progressData, isLoading } = useQuery({
    queryKey: ['module-progress', moduleId],
    queryFn: () => getUserModuleProgress(moduleId),
    enabled: !!moduleId
  });
  
  // Update local state when data is loaded
  useEffect(() => {
    if (progressData) {
      setCurrentProgress(progressData.progress || 0);
      setIsCompleted(progressData.completed || false);
      // If progress is over 50, the user has likely attempted an exercise
      setHasAttemptedExercise(progressData.progress > 50);
    }
  }, [progressData]);
  
  // Mark exercise as attempted
  const markExerciseAttempted = () => {
    setHasAttemptedExercise(true);
  };
  
  // Function to update progress
  const updateProgress = async (newProgress: number) => {
    // No need to update if it's the same or less than current, unless we're forcing completion
    if (newProgress <= currentProgress && newProgress < 100) {
      return;
    }
    
    // Set local state first for immediate UI feedback
    setCurrentProgress(newProgress);
    const completed = newProgress >= 100;
    
    if (completed) {
      setIsCompleted(true);
    }
    
    try {
      // Update the current module progress
      await updateUserModuleProgress(moduleId, newProgress, completed);
      
      // If module is completed, try to unlock the next module
      if (completed) {
        try {
          // Get the module data to find the course ID
          const module = await queryClient.fetchQuery({
            queryKey: ['module', moduleId],
            queryFn: () => getModuleById(moduleId)
          });
          
          if (module?.course_id) {
            // Get all modules for this course to find the next one
            const modules = await getModulesByCourseId(module.course_id);
            
            // Sort modules by order_index
            const sortedModules = [...modules].sort((a, b) => a.order_index - b.order_index);
            
            // Find current module index
            const currentIndex = sortedModules.findIndex(m => m.id === moduleId);
            
            // If there's a next module, unlock it
            if (currentIndex >= 0 && currentIndex < sortedModules.length - 1) {
              const nextModule = sortedModules[currentIndex + 1];
              console.log("Unlocking next module:", nextModule.title);
              // Initialize progress for next module to make it available
              await updateUserModuleProgress(nextModule.id, 0, false);
            }
          }
          
          toast({
            title: "Module Completed!",
            description: "You've successfully completed this module.",
            variant: "default",
          });
        } catch (error) {
          console.error("Error unlocking next module:", error);
          // We don't want to break the flow if unlocking fails
        }
      }
      
      // Invalidate related queries to ensure data is fresh everywhere
      queryClient.invalidateQueries({ queryKey: ['module-progress'] });
      queryClient.invalidateQueries({ queryKey: ['course-modules'] });
      queryClient.invalidateQueries({ queryKey: ['userCourses'] });
      queryClient.invalidateQueries({ queryKey: ['user-courses'] });
      
    } catch (error) {
      console.error("Error updating progress:", error);
      toast({
        title: "Error Updating Progress",
        description: "There was a problem updating your progress.",
        variant: "destructive",
      });
    }
  };
  
  return {
    currentProgress,
    isCompleted,
    hasAttemptedExercise,
    markExerciseAttempted,
    updateProgress,
    isLoading
  };
}
