
import { Card, CardContent } from "@/components/ui/card";
import { MoleculeViewer } from "@/components/MoleculeViewer";
import { PeriodicTableInteractive } from "@/components/PeriodicTableInteractive";
import { VirtualLabPreview } from "@/components/VirtualLabPreview";

interface InteractiveContentProps {
  interactiveType: "molecule" | "periodic-table" | "chemical-reaction";
}

export const InteractiveContent = ({ interactiveType }: InteractiveContentProps) => {
  console.log("Rendering content for:", interactiveType);
  
  switch(interactiveType) {
    case "molecule":
      return <MoleculeViewer />;
      
    case "periodic-table":
      return <PeriodicTableInteractive />;
      
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
