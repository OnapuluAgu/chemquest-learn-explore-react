
import { useState, useEffect } from "react";
import { getUserModuleProgress, updateUserModuleProgress } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

export function useModuleProgress(moduleId: string) {
  const [currentProgress, setCurrentProgress] = useState(0);
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
    }
  }, [progressData]);
  
  // Function to update progress
  const updateProgress = async (newProgress: number) => {
    // No need to update if it's the same or less than current
    if (newProgress <= currentProgress) {
      return;
    }
    
    setCurrentProgress(newProgress);
    
    try {
      const completed = newProgress >= 100;
      await updateUserModuleProgress(moduleId, newProgress, completed);
      
      // Invalidate related queries to ensure data is fresh everywhere
      queryClient.invalidateQueries({ queryKey: ['module-progress', moduleId] });
      queryClient.invalidateQueries({ queryKey: ['userCourses'] });
      
      if (completed) {
        toast({
          title: "Module Completed!",
          description: "You've successfully completed this module.",
          variant: "default",
        });
      }
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
    updateProgress,
    isLoading
  };
}
