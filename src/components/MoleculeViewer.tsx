
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Atom } from "lucide-react";

export const MoleculeViewer = () => {
  const [isRotating, setIsRotating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  
  useEffect(() => {
    let animationFrameId: number;
    
    const rotate = () => {
      if (containerRef.current && isRotating) {
        angleRef.current += 0.5;
        containerRef.current.style.transform = `rotateY(${angleRef.current}deg)`;
        animationFrameId = requestAnimationFrame(rotate);
      }
    };
    
    if (isRotating) {
      animationFrameId = requestAnimationFrame(rotate);
    }
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isRotating]);
  
  const toggleRotation = () => {
    setIsRotating(prev => !prev);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">3D Molecule Viewer</h2>
      <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
        <div 
          ref={containerRef} 
          className="text-center p-6 transition-transform duration-100"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div style={{ transform: 'translateZ(50px)' }}>
            <Atom className="h-32 w-32 mx-auto text-chemistry-purple mb-4" />
          </div>
          <h3 className="text-lg font-medium mb-2">Interactive 3D Molecule</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-4">
            Explore chemical structures in 3D space. Rotate, zoom, and examine bond angles.
          </p>
          <Button 
            className="bg-chemistry-purple hover:bg-chemistry-blue"
            onClick={toggleRotation}
          >
            {isRotating ? 'Stop Rotation' : 'Rotate Molecule'}
          </Button>
        </div>
      </div>
    </div>
  );
};
