
import { Link } from "react-router-dom";
import { ArrowLeft, Info, Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InteractiveHeaderProps {
  moduleId: string | null;
  interactiveType: "molecule" | "periodic-table" | "chemical-reaction";
  onInfoClick: () => void;
}

export const InteractiveHeader = ({ 
  moduleId, 
  interactiveType,
  onInfoClick
}: InteractiveHeaderProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <Button asChild variant="outline" size="sm">
          <Link to={moduleId ? `/module/${moduleId}` : "/dashboard"} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to {moduleId ? "Module" : "Dashboard"}
          </Link>
        </Button>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onInfoClick}>
            <Info className="h-4 w-4 mr-1" /> Info
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4 mr-1" /> Share
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4 mr-1" /> Download
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {interactiveType === "molecule" && "3D Molecule Viewer"}
          {interactiveType === "periodic-table" && "Interactive Periodic Table"}
          {interactiveType === "chemical-reaction" && "Chemical Reaction Simulator"}
        </h1>
        <p className="text-gray-600 mt-2">
          {interactiveType === "molecule" && "Explore and manipulate molecular structures in 3D space"}
          {interactiveType === "periodic-table" && "Explore elements and their properties"}
          {interactiveType === "chemical-reaction" && "Simulate and visualize chemical reactions"}
        </p>
      </div>
    </>
  );
};
