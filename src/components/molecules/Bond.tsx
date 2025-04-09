
import { useRef, useEffect } from "react";
import * as THREE from "three";

interface BondProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
}

export const Bond = ({ start, end, color = "#888888" }: BondProps) => {
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
