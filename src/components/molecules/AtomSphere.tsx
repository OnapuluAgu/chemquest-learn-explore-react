
import { FC } from "react";

interface AtomSphereProps {
  position: [number, number, number];
  color: string;
  scale?: number;
}

export const AtomSphere: FC<AtomSphereProps> = ({ position, color, scale = 1 }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.5 * scale, 16, 16]} />
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.3} />
    </mesh>
  );
};
