
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { getModuleById } from "@/lib/api";
import { InteractiveHeader } from "@/components/interactive/InteractiveHeader";
import { InteractiveContent } from "@/components/interactive/InteractiveContent";
import { InteractiveSidebar } from "@/components/interactive/InteractiveSidebar";
import { InteractiveInfoDialog } from "@/components/interactive/InteractiveInfoDialog";
import { useInteractiveModule, InteractiveType } from "@/hooks/useInteractiveModule";

interface InteractiveProps {
  interactiveType?: InteractiveType;
}

const ModuleInteractivePage = ({ interactiveType: propType }: InteractiveProps) => {
  const { interactiveId } = useParams<{ interactiveId: string }>();
  const [searchParams] = useSearchParams();
  const urlType = searchParams.get("type") || "";
  const moduleId = searchParams.get("moduleId") || "";
  
  const {
    interactiveType,
    infoDialogOpen,
    currentProgress,
    setInfoDialogOpen,
    handleTypeChange,
    toggleInfoDialog,
    updateProgress
  } = useInteractiveModule(interactiveId, moduleId, urlType, propType);
  
  const { 
    data: module,
    isLoading: isLoadingModule 
  } = useQuery({
    queryKey: ['module', moduleId],
    queryFn: () => getModuleById(moduleId),
    enabled: !!moduleId
  });

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <InteractiveHeader
          moduleId={moduleId}
          interactiveType={interactiveType}
          onInfoClick={toggleInfoDialog}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <InteractiveContent interactiveType={interactiveType} />
          </div>
          
          <div>
            <InteractiveSidebar
              interactiveType={interactiveType}
              handleTypeChange={handleTypeChange}
              moduleId={moduleId}
              currentProgress={currentProgress}
              updateProgress={updateProgress}
            />
          </div>
        </div>
        
        <InteractiveInfoDialog
          open={infoDialogOpen}
          onOpenChange={setInfoDialogOpen}
          interactiveType={interactiveType}
        />
      </div>
    </Layout>
  );
};

export default ModuleInteractivePage;
