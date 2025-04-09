
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Atom, Table2, Beaker, ExternalLink } from "lucide-react";

interface InteractiveSidebarProps {
  interactiveType: "molecule" | "periodic-table" | "chemical-reaction";
  handleTypeChange: (newType: string) => void;
  moduleId: string | null;
  currentProgress: number;
  updateProgress: (progress: number) => void;
}

export const InteractiveSidebar = ({
  interactiveType,
  handleTypeChange,
  moduleId,
  currentProgress,
  updateProgress
}: InteractiveSidebarProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-3">Module Type</h3>
          <div className="space-y-2">
            <Button 
              variant={interactiveType === "molecule" ? "default" : "outline"}
              className={`w-full justify-start ${interactiveType === "molecule" ? "bg-chemistry-purple" : ""}`}
              onClick={() => handleTypeChange("molecule")}
            >
              <Atom className="h-4 w-4 mr-2" /> 3D Molecule
            </Button>
            
            <Button 
              variant={interactiveType === "periodic-table" ? "default" : "outline"}
              className={`w-full justify-start ${interactiveType === "periodic-table" ? "bg-chemistry-blue" : ""}`}
              onClick={() => handleTypeChange("periodic-table")}
            >
              <Table2 className="h-4 w-4 mr-2" /> Periodic Table
            </Button>
            
            <Button 
              variant={interactiveType === "chemical-reaction" ? "default" : "outline"}
              className={`w-full justify-start ${interactiveType === "chemical-reaction" ? "bg-chemistry-purple" : ""}`}
              onClick={() => handleTypeChange("chemical-reaction")}
            >
              <Beaker className="h-4 w-4 mr-2" /> Chemical Reaction
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {moduleId && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Your Progress</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Module Completion</span>
                <span>{currentProgress}%</span>
              </div>
              <Progress value={currentProgress} className="h-2" />
              <Button 
                className="w-full mt-2 bg-chemistry-purple" 
                onClick={() => updateProgress(100)}
              >
                Mark as Completed
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-3">Related Resources</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-sm text-chemistry-purple hover:underline flex items-center">
                <ExternalLink className="h-3 w-3 mr-2" /> Guide to Chemical Bonding
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-chemistry-purple hover:underline flex items-center">
                <ExternalLink className="h-3 w-3 mr-2" /> Principles of Molecular Structure
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-chemistry-purple hover:underline flex items-center">
                <ExternalLink className="h-3 w-3 mr-2" /> Video: Advanced Chemistry Concepts
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
