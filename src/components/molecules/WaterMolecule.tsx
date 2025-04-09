
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { AtomSphere } from "./AtomSphere";
import { Bond } from "./Bond";

interface WaterMoleculeProps {
  rotate: boolean;
}

export const WaterMolecule = ({ rotate }: WaterMoleculeProps) => {
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
