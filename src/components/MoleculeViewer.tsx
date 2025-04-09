
import { useRef, useState, Suspense } from "react";
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

// Simple Bond component
const Bond = ({ start, end, color = "#888888" }: { start: [number, number, number]; end: [number, number, number]; color?: string }) => {
  // Calculate the midpoint between the two atoms
  const midX = (start[0] + end[0]) / 2;
  const midY = (start[1] + end[1]) / 2;
  const midZ = (start[2] + end[2]) / 2;
  
  // Calculate the distance between the two atoms
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const dz = end[2] - start[2];
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
  
  // Create a cylinder geometry for the bond
  const geometry = new THREE.CylinderGeometry(0.1, 0.1, length, 8);
  geometry.translate(0, length/2, 0);
  geometry.rotateX(Math.PI/2);
  
  // Calculate the direction vector
  const direction = new THREE.Vector3(dx, dy, dz).normalize();
  
  // Create a quaternion to rotate the cylinder to align with the direction
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);
  
  return (
    <group position={[start[0], start[1], start[2]]} quaternion={quaternion}>
      <mesh>
        <primitive object={geometry} attach="geometry" />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
    </group>
  );
};

// Rotating molecule model - H₂O (water)
const WaterMolecule = ({ rotate }: { rotate: boolean }) => {
  const moleculeRef = useRef<THREE.Group>(null);
  
  return (
    <group ref={moleculeRef} rotation={[0, rotate ? Date.now() * 0.001 : 0, 0]}>
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
  
  return (
    <group ref={moleculeRef} rotation={[0, rotate ? Date.now() * 0.001 : 0, 0]}>
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

// Wrapper component for automatic rotation
const RotatingMolecule = ({ type, isRotating }: { type: string; isRotating: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // We're using a static presentation without useFrame to avoid potential compatibility issues
  return (
    <group ref={groupRef}>
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
            
            <RotatingMolecule 
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
