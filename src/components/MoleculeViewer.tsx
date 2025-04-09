
import { useRef, useState, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, PerspectiveCamera } from "@react-three/drei";
import { Button } from "./ui/button";
import { Atom, Plus, Minus } from "lucide-react";
import * as THREE from "three";

// Atom component for the molecule
const AtomSphere = ({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.5 * scale, 16, 16]} />
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.3} />
    </mesh>
  );
};

// Simplified Bond component that uses direct THREE.js objects
const Bond = ({ start, end, color = "#888888" }: { start: [number, number, number]; end: [number, number, number]; color?: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useEffect(() => {
    if (!meshRef.current) return;
    
    // Calculate the midpoint
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const midPoint = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
    
    // Set position to midpoint
    meshRef.current.position.copy(midPoint);
    
    // Calculate direction and length
    const direction = new THREE.Vector3().subVectors(endVec, startVec);
    const length = direction.length();
    
    // Set the scale to match the bond length (the cylinder's height is along the Y-axis)
    meshRef.current.scale.set(1, length, 1);
    
    // Calculate rotation to align the cylinder with the bond direction
    if (Math.abs(direction.y) > 0.99 * length) {
      // Special case: bond is nearly parallel to Y-axis
      // No rotation needed if it's aligned with the Y-axis, just scale
      if (direction.y < 0) {
        // If pointing downward, flip the cylinder
        meshRef.current.scale.y = -length;
      }
    } else {
      // Normal case: use lookAt to orient the cylinder
      // We need to rotate the cylinder (which is oriented along the Y-axis)
      // The lookAt method aligns the Z-axis with the target, so we need an adjustment
      
      // Create temporary vectors for alignment
      const up = new THREE.Vector3(0, 1, 0);
      
      // Create a target position by adding the direction to the midpoint
      const target = new THREE.Vector3().copy(midPoint).add(direction);
      
      // Create a matrix to perform the orientation
      const matrix = new THREE.Matrix4();
      matrix.lookAt(midPoint, target, up);
      
      // Convert to quaternion and then to Euler angles
      const quaternion = new THREE.Quaternion().setFromRotationMatrix(matrix);
      
      // Additional 90-degree rotation to align the cylinder's Y-axis with the bond direction
      const adjustment = new THREE.Euler(Math.PI / 2, 0, 0);
      const adjustQuat = new THREE.Quaternion().setFromEuler(adjustment);
      quaternion.multiply(adjustQuat);
      
      // Apply the rotation
      meshRef.current.quaternion.copy(quaternion);
    }
  }, [start, end]);

  return (
    <mesh ref={meshRef}>
      <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
      <meshStandardMaterial color={color} roughness={0.5} />
    </mesh>
  );
};

// Simple component for water molecule with manual rotation
const WaterMolecule = ({ rotate }: { rotate: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  
  useEffect(() => {
    if (!rotate) return;
    
    const interval = setInterval(() => {
      setRotationAngle(prev => prev + 0.01);
    }, 16);
    
    return () => clearInterval(interval);
  }, [rotate]);
  
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotationAngle;
    }
  }, [rotationAngle]);
  
  return (
    <group ref={groupRef}>
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
  const [rotationAngle, setRotationAngle] = useState(0);
  
  useEffect(() => {
    if (!rotate) return;
    
    const interval = setInterval(() => {
      setRotationAngle(prev => prev + 0.01);
    }, 16);
    
    return () => clearInterval(interval);
  }, [rotate]);
  
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotationAngle;
    }
  }, [rotationAngle]);
  
  return (
    <group ref={groupRef}>
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
    <>
      {type === "water" ? (
        <WaterMolecule rotate={isRotating} />
      ) : (
        <MethaneMolecule rotate={isRotating} />
      )}
    </>
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
