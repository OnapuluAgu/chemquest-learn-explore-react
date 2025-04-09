
import { useRef, useState, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, Environment, PerspectiveCamera } from "@react-three/drei";
import { Button } from "./ui/button";
import { Atom, Plus, Minus } from "lucide-react";
import * as THREE from "three";

// Atom component for the molecule
const AtomSphere = ({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) => {
  return (
    <Sphere args={[0.5 * scale, 16, 16]} position={position}>
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.3} />
    </Sphere>
  );
};

// Simplified Bond component that uses a cylinder directly
const Bond = ({ start, end, color = "#888888" }: { start: [number, number, number]; end: [number, number, number]; color?: string }) => {
  const bondRef = useRef<THREE.Mesh>(null);
  
  useEffect(() => {
    if (!bondRef.current) return;
    
    // Calculate the midpoint
    const midpoint = new THREE.Vector3(
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2,
      (start[2] + end[2]) / 2
    );
    
    // Set position to midpoint
    bondRef.current.position.set(midpoint.x, midpoint.y, midpoint.z);
    
    // Calculate bond length
    const direction = new THREE.Vector3(
      end[0] - start[0],
      end[1] - start[1],
      end[2] - start[2]
    );
    const length = direction.length();
    
    // Scale the cylinder to match the bond length
    bondRef.current.scale.y = length;
    
    // Orient the cylinder
    direction.normalize();
    
    // Default cylinder orientation is along the Y-axis
    // We need to align it with our direction vector
    const defaultDirection = new THREE.Vector3(0, 1, 0);
    
    // Handle the case when direction is parallel to the default direction
    if (Math.abs(direction.y) > 0.99) {
      // Almost parallel to Y-axis, use a different rotation approach
      const sign = Math.sign(direction.y);
      bondRef.current.rotation.set(0, 0, 0);
      bondRef.current.scale.y = length * sign;
    } else {
      // For other cases, use the standard approach
      const quaternion = new THREE.Quaternion();
      quaternion.setFromUnitVectors(defaultDirection, direction);
      bondRef.current.setRotationFromQuaternion(quaternion);
    }
  }, [start, end]);

  return (
    <mesh ref={bondRef}>
      <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
      <meshStandardMaterial color={color} roughness={0.5} />
    </mesh>
  );
};

// Simple component for water molecule that doesn't rely on dynamic dates for rotation
const WaterMolecule = ({ rotate }: { rotate: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    if (!rotate) return;
    
    const interval = setInterval(() => {
      setRotation((prev) => prev + 0.01);
    }, 16);
    
    return () => clearInterval(interval);
  }, [rotate]);
  
  return (
    <group ref={groupRef} rotation={[0, rotation, 0]}>
      {/* Oxygen atom (center) */}
      <AtomSphere position={[0, 0, 0]} color="#ff3333" scale={1.3} />
      
      {/* Hydrogen atoms */}
      <AtomSphere position={[-1.2, 0.8, 0]} color="#ffffff" scale={0.8} />
      <AtomSphere position={[1.2, 0.8, 0]} color="#ffffff" scale={0.8} />
      
      {/* Bonds */}
      <Bond start={[0, 0, 0]} end={[-1.2, 0.8, 0]} />
      <Bond start={[0, 0, 0]} end={[1.2, 0.8, 0]} />
    </group>
  );
};

// Methane molecule (CH₄)
const MethaneMolecule = ({ rotate }: { rotate: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    if (!rotate) return;
    
    const interval = setInterval(() => {
      setRotation((prev) => prev + 0.01);
    }, 16);
    
    return () => clearInterval(interval);
  }, [rotate]);
  
  return (
    <group ref={groupRef} rotation={[0, rotation, 0]}>
      {/* Carbon atom (center) */}
      <AtomSphere position={[0, 0, 0]} color="#555555" scale={1.2} />
      
      {/* Hydrogen atoms in tetrahedral arrangement */}
      <AtomSphere position={[1, 1, 1]} color="#ffffff" scale={0.8} />
      <AtomSphere position={[-1, -1, 1]} color="#ffffff" scale={0.8} />
      <AtomSphere position={[1, -1, -1]} color="#ffffff" scale={0.8} />
      <AtomSphere position={[-1, 1, -1]} color="#ffffff" scale={0.8} />
      
      {/* Bonds */}
      <Bond start={[0, 0, 0]} end={[1, 1, 1]} />
      <Bond start={[0, 0, 0]} end={[-1, -1, 1]} />
      <Bond start={[0, 0, 0]} end={[1, -1, -1]} />
      <Bond start={[0, 0, 0]} end={[-1, 1, -1]} />
    </group>
  );
};

// Wrapper component for molecule
const MoleculeWrapper = ({ type, isRotating }: { type: string; isRotating: boolean }) => {
  return (
    <group>
      {type === "water" ? (
        <WaterMolecule rotate={isRotating} />
      ) : (
        <MethaneMolecule rotate={isRotating} />
      )}
    </group>
  );
};

export const MoleculeViewer = () => {
  const [isRotating, setIsRotating] = useState(false);
  const [zoom, setZoom] = useState(5);
  const [activeMolecule, setActiveMolecule] = useState("water");
  
  const handleZoomIn = () => {
    setZoom(prev => Math.max(prev - 1, 2));
  };
  
  const handleZoomOut = () => {
    setZoom(prev => Math.min(prev + 1, 10));
  };
  
  const toggleRotation = () => {
    setIsRotating(prev => !prev);
  };
  
  const changeMolecule = () => {
    setActiveMolecule(prev => prev === "water" ? "methane" : "water");
  };
  
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">3D Molecule Viewer</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            className="px-2"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            className="px-2"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
        <Suspense fallback={<div className="flex items-center justify-center h-full">Loading 3D model...</div>}>
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, zoom]} fov={45} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            
            <MoleculeWrapper 
              type={activeMolecule} 
              isRotating={isRotating} 
            />
            
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              autoRotate={false}
            />
            <Environment preset="city" />
          </Canvas>
        </Suspense>
      </div>
      
      <div className="flex justify-between mt-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Current molecule:</span> {activeMolecule === "water" ? "Water (H₂O)" : "Methane (CH₄)"}
          </p>
          <Button 
            variant="outline"
            size="sm"
            onClick={changeMolecule}
            className="mr-2"
          >
            Switch Molecule
          </Button>
        </div>
        
        <Button 
          className="bg-chemistry-purple hover:bg-chemistry-blue"
          onClick={toggleRotation}
        >
          <Atom className="h-4 w-4 mr-2" />
          {isRotating ? 'Stop Rotation' : 'Rotate Molecule'}
        </Button>
      </div>
    </div>
  );
};
