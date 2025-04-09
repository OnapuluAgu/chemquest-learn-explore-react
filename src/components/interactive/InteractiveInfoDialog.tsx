
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface InteractiveInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interactiveType: "molecule" | "periodic-table" | "chemical-reaction";
}

export const InteractiveInfoDialog = ({
  open,
  onOpenChange,
  interactiveType,
}: InteractiveInfoDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
};
