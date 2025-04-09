
import { useState, useEffect } from "react";
import { useModuleProgress } from "@/hooks/useModuleProgress";

export type InteractiveType = "molecule" | "periodic-table" | "chemical-reaction";

export const useInteractiveModule = (
  initialType: string = "",
  moduleId: string | null = null,
  urlType: string = "",
  propType?: InteractiveType
) => {
  const determineInteractiveType = (): InteractiveType => {
    if (propType) return propType;
    if (urlType) {
      if (urlType.includes("molecule")) return "molecule";
      if (urlType.includes("periodic") || urlType.includes("table")) return "periodic-table";
      if (urlType.includes("chemical") || urlType.includes("reaction")) return "chemical-reaction";
    }
    const path = window.location.pathname.toLowerCase();
    if (path.includes("molecule")) return "molecule";
    if (path.includes("periodic") || path.includes("table")) return "periodic-table";
    if (path.includes("chemical") || path.includes("reaction")) return "chemical-reaction";
    return "molecule";
  };
  
  const [interactiveType, setInteractiveType] = useState<InteractiveType>(determineInteractiveType());
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  
  const { 
    currentProgress, 
    updateProgress 
  } = useModuleProgress(moduleId || "");
  
  useEffect(() => {
    if (moduleId) {
      const newProgress = Math.min(currentProgress + 25, 100);
      updateProgress(newProgress);
    }
  }, [moduleId, interactiveType]);
  
  useEffect(() => {
    console.log("Interactive module rendered with type:", interactiveType);
    console.log("Path:", window.location.pathname);
    console.log("URL type param:", urlType);
    console.log("Prop type:", propType);
  }, [interactiveType, urlType, propType]);
  
  const handleTypeChange = (newType: string) => {
    let mappedType: InteractiveType = "molecule";
    
    if (newType.includes("periodic") || newType === "table") {
      mappedType = "periodic-table";
    } else if (newType.includes("chemical") || newType === "reaction") {
      mappedType = "chemical-reaction";
    }
    
    setInteractiveType(mappedType);
    console.log("Type changed to:", mappedType);
  };
  
  const toggleInfoDialog = () => {
    setInfoDialogOpen(!infoDialogOpen);
  };
  
  return {
    interactiveType,
    infoDialogOpen,
    currentProgress,
    setInfoDialogOpen,
    handleTypeChange,
    toggleInfoDialog,
    updateProgress
  };
};
