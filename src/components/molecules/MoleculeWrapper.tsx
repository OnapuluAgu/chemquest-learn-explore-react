
import { FC } from "react";
import { WaterMolecule } from "./WaterMolecule";
import { MethaneMolecule } from "./MethaneMolecule";

interface MoleculeWrapperProps {
  type: string;
  isRotating: boolean;
}

export const MoleculeWrapper: FC<MoleculeWrapperProps> = ({ type, isRotating }) => {
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
