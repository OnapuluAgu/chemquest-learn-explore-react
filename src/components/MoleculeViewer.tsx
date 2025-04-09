
import { useRef, useState, Suspense } from "react";
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

// Bond component for connecting atoms
const Bond = ({ start, end, color = "#888888" }: { start: [number, number, number]; end: [number, number, number]; color?: string }) => {
  // Create midpoint
  const midpoint = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2
  ];
  
  // Create a cylinder that represents our bond
  const bondRef = useRef<THREE.Mesh>(null);
  
  // Calculate direction and length
  const direction = new THREE.Vector3(
    end[0] - start[0],
    end[1] - start[1], 
    end[2] - start[2]
  );
  const length = direction.length();
  
  // We need to create a custom geometry for our bond instead of using the Cylinder component
  // This helps avoid serialization issues
  return (
    <group position={[midpoint[0], midpoint[1], midpoint[2]]}>
      <mesh ref={bondRef}>
        <cylinderGeometry args={[0.1, 0.1, length, 8]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
    </group>
  );
};

// Custom bond that handles its own rotation correctly
const BondWithRotation = ({ start, end, color = "#888888" }: { start: [number, number, number]; end: [number, number, number]; color?: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Set up the bond once it's mounted
  useFrame(() => {
    if (meshRef.current) {
      // Calculate direction vector
      const direction = new THREE.Vector3(
        end[0] - start[0],
        end[1] - start[1],
        end[2] - start[2]
      );
      
      // Position at midpoint
      const midpoint = new THREE.Vector3(
        (start[0] + end[0]) / 2,
        (start[1] + end[1]) / 2,
        (start[2] + end[2]) / 2
      );
      meshRef.current.position.copy(midpoint);
      
      // Orient the cylinder (which defaults to being aligned with the Y-axis)
      // We need to rotate it to align with our direction vector
      
      // First, set the quaternion to identity (no rotation)
      meshRef.current.quaternion.identity();
      
      // Create a temporary up vector (the cylinder's default orientation is along the Y-axis)
      const up = new THREE.Vector3(0, 1, 0);
      
      // Calculate the axis and angle to rotate from the up vector to our direction
      direction.normalize(); // Normalize to get just the direction
      
      // Handle special case when direction is parallel to up vector
      if (Math.abs(direction.y) > 0.99999) {
        // If pointing exactly up or down, use a simplified rotation
        if (direction.y < 0) {
          // If pointing down, rotate 180 degrees around X
          meshRef.current.rotateX(Math.PI);
        }
        // If pointing up, no rotation needed
      } else {
        // For all other cases, we create a quaternion that rotates from up to direction
        const quaternion = new THREE.Quaternion();
        const axis = new THREE.Vector3();
        
        // Cross product gives us the axis of rotation
        axis.crossVectors(up, direction).normalize();
        
        // The angle between up and direction
        const angle = Math.acos(up.dot(direction));
        
        // Set quaternion from axis and angle
        quaternion.setFromAxisAngle(axis, angle);
        
        // Apply the rotation
        meshRef.current.quaternion.copy(quaternion);
      }
      
      // Set the scale to make the cylinder the right length
      const length = new THREE.Vector3(
        end[0] - start[0],
        end[1] - start[1],
        end[2] - start[2]
      ).length();
      
      meshRef.current.scale.set(1, length, 1);
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
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
      <BondWithRotation start={[0, 0, 0]} end={[-1.2, 0.8, 0]} />
      <BondWithRotation start={[0, 0, 0]} end={[1.2, 0.8, 0]} />
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
      <BondWithRotation start={[0, 0, 0]} end={[1, 1, 1]} />
      <BondWithRotation start={[0, 0, 0]} end={[-1, -1, 1]} />
      <BondWithRotation start={[0, 0, 0]} end={[1, -1, -1]} />
      <BondWithRotation start={[0, 0, 0]} end={[-1, 1, -1]} />
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
