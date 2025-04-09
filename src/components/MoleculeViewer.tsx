
import { useRef, useState, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
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

// Simplified Bond component - using a simple cylinder between two points
const Bond = ({ start, end, color = "#888888" }: { start: [number, number, number]; end: [number, number, number]; color?: string }) => {
  // Convert array positions to Vector3 for calculations
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  
  // Calculate midpoint for cylinder position
  const midpoint = startVec.clone().add(endVec).multiplyScalar(0.5);
  
  // Calculate direction vector
  const direction = endVec.clone().sub(startVec);
  const length = direction.length();
  
  // Normalize direction vector
  direction.normalize();
  
  // Create quaternion from direction
  // We need to align our cylinder with the direction vector
  // Cylinders are aligned with the Y axis by default
  const quaternion = new THREE.Quaternion();
  
  // Default direction is along Y-axis (0, 1, 0)
  const defaultDirection = new THREE.Vector3(0, 1, 0);
  
  // Handle cases where direction is parallel to default direction
  if (Math.abs(defaultDirection.dot(direction)) > 0.99) {
    // If parallel but possibly in opposite direction
    if (direction.y < 0) {
      // Pointing down Y-axis, rotate 180 degrees around X
      quaternion.setFromEuler(new THREE.Euler(Math.PI, 0, 0));
    }
  } else {
    // Calculate rotation axis and angle for non-parallel cases
    const rotationAxis = new THREE.Vector3().crossVectors(defaultDirection, direction).normalize();
    const angle = Math.acos(defaultDirection.dot(direction));
    quaternion.setFromAxisAngle(rotationAxis, angle);
  }
  
  return (
    <mesh position={[midpoint.x, midpoint.y, midpoint.z]} quaternion={quaternion}>
      <cylinderGeometry args={[0.1, 0.1, length, 8]} />
      <meshStandardMaterial color={color} roughness={0.5} />
    </mesh>
  );
};

// Rotating molecule model - H₂O (water)
const WaterMolecule = ({ rotate }: { rotate: boolean }) => {
  const moleculeRef = useRef<THREE.Group>(null);
  
  // Animation for the molecule rotation
  useFrame((state, delta) => {
    if (moleculeRef.current && rotate) {
      moleculeRef.current.rotation.y += delta * 0.5;
      moleculeRef.current.rotation.x += delta * 0.2;
    }
  });

  return (
    <group ref={moleculeRef}>
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
  const moleculeRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (moleculeRef.current && rotate) {
      moleculeRef.current.rotation.y += delta * 0.5;
      moleculeRef.current.rotation.x += delta * 0.2;
    }
  });

  return (
    <group ref={moleculeRef}>
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
          <Canvas className="w-full h-full">
            <PerspectiveCamera makeDefault position={[0, 0, zoom]} fov={45} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            
            {activeMolecule === "water" ? (
              <WaterMolecule rotate={isRotating} />
            ) : (
              <MethaneMolecule rotate={isRotating} />
            )}
            
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
