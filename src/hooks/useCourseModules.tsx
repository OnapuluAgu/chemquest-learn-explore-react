
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getModulesByCourseId, getUserModuleProgress } from "@/lib/api";
import { Module } from "@/lib/api/types";

export function useCourseModules(courseId: string) {
  const [moduleProgress, setModuleProgress] = useState<Record<string, { progress: number, completed: boolean }>>({});
  
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

  // Helper function to determine module status based on progress
  const getModuleStatus = (progress: number | null, completed: boolean | null) => {
    if (completed) return "completed";
    if (progress && progress > 0) return "in-progress";
    return "not-started";
  };

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

  return {
    modules: sortedModules,
    isLoadingModules,
    modulesError,
    moduleProgress,
    getModuleStatus,
    isModuleLocked,
    getFirstAvailableModule,
    calculateCourseProgress
  };
}
