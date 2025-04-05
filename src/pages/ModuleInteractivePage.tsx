import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { ArrowLeft, ExternalLink, Download, Share2, Info, Table2, Beaker, Atom } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getModuleById } from "@/lib/api";
import { VirtualLabPreview } from "@/components/VirtualLabPreview";
import { useModuleProgress } from "@/hooks/useModuleProgress";

interface InteractiveProps {
  interactiveType?: "molecule" | "periodic-table" | "chemical-reaction";
}

const ModuleInteractivePage = ({ interactiveType: propType }: InteractiveProps) => {
  const { interactiveId } = useParams<{ interactiveId: string }>();
  const [searchParams] = useSearchParams();
  const urlType = searchParams.get("type") || "";
  const moduleId = searchParams.get("moduleId") || "";
  
  const determineInteractiveType = () => {
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
  
  const [interactiveType, setInteractiveType] = useState(determineInteractiveType());
  
  const { currentProgress, updateProgress } = useModuleProgress(moduleId);
  
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  
  const { 
    data: module,
    isLoading: isLoadingModule 
  } = useQuery({
    queryKey: ['module', moduleId],
    queryFn: () => getModuleById(moduleId),
    enabled: !!moduleId
  });
  
  useEffect(() => {
    if (moduleId) {
      const newProgress = Math.min(currentProgress + 25, 100);
      updateProgress(newProgress);
    }
  }, [moduleId, interactiveType]);
  
  useEffect(() => {
    console.log("ModuleInteractivePage rendered with type:", interactiveType);
    console.log("Path:", window.location.pathname);
    console.log("URL type param:", urlType);
    console.log("Prop type:", propType);
  }, [interactiveType, urlType, propType]);
  
  const handleTypeChange = (newType: string) => {
    let mappedType: "molecule" | "periodic-table" | "chemical-reaction" = "molecule";
    
    if (newType.includes("periodic") || newType === "table") {
      mappedType = "periodic-table";
    } else if (newType.includes("chemical") || newType === "reaction") {
      mappedType = "chemical-reaction";
    }
    
    setInteractiveType(mappedType);
    console.log("Type changed to:", mappedType);
  };
  
  const renderInteractiveContent = () => {
    console.log("Rendering content for:", interactiveType);
    
    switch(interactiveType) {
      case "molecule":
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">3D Molecule Viewer</h2>
            <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
              <div className="text-center p-6">
                <Atom className="h-16 w-16 mx-auto text-chemistry-purple mb-4" />
                <h3 className="text-lg font-medium mb-2">Interactive 3D Molecule</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-4">
                  Explore chemical structures in 3D space. Rotate, zoom, and examine bond angles.
                </p>
                <Button className="bg-chemistry-purple">
                  Rotate Molecule
                </Button>
              </div>
            </div>
          </div>
        );
        
      case "periodic-table":
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Interactive Periodic Table</h2>
            <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
              <div className="text-center p-6">
                <Table2 className="h-16 w-16 mx-auto text-chemistry-blue mb-4" />
                <h3 className="text-lg font-medium mb-2">Periodic Table Explorer</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-4">
                  Explore elements, their properties, and relationship patterns across the periodic table of elements.
                </p>
                <Button className="bg-chemistry-blue">
                  Explore Elements
                </Button>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-8 gap-1">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="aspect-square bg-chemistry-soft-purple rounded flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xs font-bold">{i+1}</div>
                    <div className="text-lg font-bold">{['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S'][i]}</div>
                    <div className="text-xs">{['Hydrogen', 'Helium', 'Lithium', 'Beryllium', 'Boron', 'Carbon', 'Nitrogen', 'Oxygen', 'Fluorine', 'Neon', 'Sodium', 'Magnesium', 'Aluminum', 'Silicon', 'Phosphorus', 'Sulfur'][i]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case "chemical-reaction":
        return (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Chemical Reaction Simulator</h2>
              <div className="space-y-6">
                <VirtualLabPreview />
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Reaction Details</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    This simulator demonstrates an acid-base neutralization reaction, showing how pH changes as base is added to acid.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Reaction type:</span> Acid-Base Neutralization
                    </div>
                    <div>
                      <span className="font-medium">Reaction rate:</span> Moderate
                    </div>
                    <div>
                      <span className="font-medium">Energy change:</span> Exothermic
                    </div>
                    <div>
                      <span className="font-medium">Reversibility:</span> Irreversible
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
        
      default:
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Interactive Demo</h2>
            <p>Select a specific interactive example type to explore.</p>
          </div>
        );
    }
  };

  const renderInfoDialog = () => (
    <Dialog open={infoDialogOpen} onOpenChange={setInfoDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>About This Interactive Module</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
              <TabsTrigger value="science">Science Background</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">About {interactiveType.replace("-", " ")}</h3>
                  <p className="text-sm text-gray-600">
                    {interactiveType === "molecule" && "3D molecule viewers allow you to explore chemical structures in three dimensions, helping you understand spatial relationships and bonding."}
                    {interactiveType === "periodic-table" && "The interactive periodic table lets you explore elements, their properties, and relationship patterns across the periodic table of elements."}
                    {interactiveType === "chemical-reaction" && "This reaction simulator demonstrates how chemicals interact, showing real-time changes in color, temperature, and product formation."}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Learning Objectives</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Understand key concepts through interactive exploration</li>
                    <li>Visualize abstract chemical principles</li>
                    <li>Connect theoretical knowledge with practical applications</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="instructions">
              <div className="space-y-4">
                <h3 className="font-medium mb-2">How to Use This Module</h3>
                <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
                  <li>Explore the interactive elements by clicking and dragging</li>
                  <li>Use the controls on the right side to adjust parameters</li>
                  <li>Observe how changes affect the simulation</li>
                  <li>Try different scenarios to deepen your understanding</li>
                </ol>
              </div>
            </TabsContent>
            
            <TabsContent value="science">
              <div className="space-y-4">
                <h3 className="font-medium mb-2">Scientific Background</h3>
                <p className="text-sm text-gray-600">
                  {interactiveType === "molecule" && "Molecular structures are determined by the arrangement of atoms and the bonds between them. The 3D structure influences a molecule's properties including reactivity, solubility, and biological function."}
                  {interactiveType === "periodic-table" && "The periodic table organizes elements based on their atomic number and properties. Elements in the same group (column) have similar chemical properties due to their electron configuration."}
                  {interactiveType === "chemical-reaction" && "Chemical reactions involve the breaking and forming of chemical bonds. Factors like temperature, concentration, and catalysts affect reaction rates. Acid-base reactions involve the transfer of protons (H+ ions)."}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-6">
          <Button asChild variant="outline" size="sm">
            <Link to={moduleId ? `/module/${moduleId}` : "/dashboard"} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to {moduleId ? "Module" : "Dashboard"}
            </Link>
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setInfoDialogOpen(true)}>
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
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            {renderInteractiveContent()}
          </div>
          
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
        </div>
        
        {renderInfoDialog()}
      </div>
    </Layout>
  );
};

export default ModuleInteractivePage;
