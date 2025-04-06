
import { useState, useEffect } from "react";
import { getUserModuleProgress, updateUserModuleProgress, getModulesByCourseId } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

export function useModuleProgress(moduleId: string) {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
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
    }
  }, [progressData]);
  
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
        // Get the course ID from the module to find the next module
        const moduleData = await queryClient.fetchQuery({
          queryKey: ['module', moduleId],
          queryFn: async () => {
            const response = await fetch(`/api/modules/${moduleId}`);
            if (!response.ok) return null;
            return response.json();
          },
        });
        
        if (moduleData?.course_id) {
          // Get all modules for this course to find the next one
          const modules = await getModulesByCourseId(moduleData.course_id);
          
          // Sort modules by order_index
          const sortedModules = [...modules].sort((a, b) => a.order_index - b.order_index);
          
          // Find current module index
          const currentIndex = sortedModules.findIndex(m => m.id === moduleId);
          
          // If there's a next module, unlock it
          if (currentIndex >= 0 && currentIndex < sortedModules.length - 1) {
            const nextModule = sortedModules[currentIndex + 1];
            // Initialize progress for next module to make it available
            await updateUserModuleProgress(nextModule.id, 0, false);
          }
        }
        
        toast({
          title: "Module Completed!",
          description: "You've successfully completed this module.",
          variant: "default",
        });
      }
      
      // Invalidate related queries to ensure data is fresh everywhere
      queryClient.invalidateQueries({ queryKey: ['module-progress', moduleId] });
      queryClient.invalidateQueries({ queryKey: ['course-modules'] });
      queryClient.invalidateQueries({ queryKey: ['userCourses'] });
      
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
    updateProgress,
    isLoading
  };
}
