
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { AtomSphere } from "./AtomSphere";
import { Bond } from "./Bond";

interface MethaneMoleculeProps {
  rotate: boolean;
}

export const MethaneMolecule = ({ rotate }: MethaneMoleculeProps) => {
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
