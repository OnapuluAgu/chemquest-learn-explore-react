
import React from 'react';
import { Table2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ElementProps = {
  atomicNumber: number;
  symbol: string;
  name: string;
  category: string;
  onClick?: () => void;
};

const elementCategories = {
  "alkali-metal": "bg-red-100 hover:bg-red-200 border-red-300",
  "alkaline-earth": "bg-orange-100 hover:bg-orange-200 border-orange-300",
  "transition-metal": "bg-yellow-100 hover:bg-yellow-200 border-yellow-300",
  "post-transition": "bg-green-100 hover:bg-green-200 border-green-300",
  "metalloid": "bg-teal-100 hover:bg-teal-200 border-teal-300",
  "nonmetal": "bg-blue-100 hover:bg-blue-200 border-blue-300",
  "noble-gas": "bg-purple-100 hover:bg-purple-200 border-purple-300",
  "lanthanide": "bg-pink-100 hover:bg-pink-200 border-pink-300",
  "actinide": "bg-rose-100 hover:bg-rose-200 border-rose-300",
  "unknown": "bg-gray-100 hover:bg-gray-200 border-gray-300"
};

const ElementTile: React.FC<ElementProps> = ({ atomicNumber, symbol, name, category, onClick }) => {
  const categoryClass = elementCategories[category as keyof typeof elementCategories] || elementCategories.unknown;
  
  return (
    <button 
      onClick={onClick}
      className={`aspect-square ${categoryClass} rounded flex flex-col items-center justify-center p-1 border text-left transition-colors`}
    >
      <div className="text-xs font-medium text-gray-600">{atomicNumber}</div>
      <div className="text-base font-bold">{symbol}</div>
      <div className="text-xs truncate w-full text-center">{name}</div>
    </button>
  );
};

// Representative elements for the periodic table
// This is a simplified version with some key elements
const periodicTableElements: ElementProps[] = [
  { atomicNumber: 1, symbol: 'H', name: 'Hydrogen', category: 'nonmetal' },
  { atomicNumber: 2, symbol: 'He', name: 'Helium', category: 'noble-gas' },
  { atomicNumber: 3, symbol: 'Li', name: 'Lithium', category: 'alkali-metal' },
  { atomicNumber: 4, symbol: 'Be', name: 'Beryllium', category: 'alkaline-earth' },
  { atomicNumber: 5, symbol: 'B', name: 'Boron', category: 'metalloid' },
  { atomicNumber: 6, symbol: 'C', name: 'Carbon', category: 'nonmetal' },
  { atomicNumber: 7, symbol: 'N', name: 'Nitrogen', category: 'nonmetal' },
  { atomicNumber: 8, symbol: 'O', name: 'Oxygen', category: 'nonmetal' },
  { atomicNumber: 9, symbol: 'F', name: 'Fluorine', category: 'nonmetal' },
  { atomicNumber: 10, symbol: 'Ne', name: 'Neon', category: 'noble-gas' },
  { atomicNumber: 11, symbol: 'Na', name: 'Sodium', category: 'alkali-metal' },
  { atomicNumber: 12, symbol: 'Mg', name: 'Magnesium', category: 'alkaline-earth' },
  { atomicNumber: 13, symbol: 'Al', name: 'Aluminum', category: 'post-transition' },
  { atomicNumber: 14, symbol: 'Si', name: 'Silicon', category: 'metalloid' },
  { atomicNumber: 15, symbol: 'P', name: 'Phosphorus', category: 'nonmetal' },
  { atomicNumber: 16, symbol: 'S', name: 'Sulfur', category: 'nonmetal' },
  { atomicNumber: 17, symbol: 'Cl', name: 'Chlorine', category: 'nonmetal' },
  { atomicNumber: 18, symbol: 'Ar', name: 'Argon', category: 'noble-gas' },
  { atomicNumber: 19, symbol: 'K', name: 'Potassium', category: 'alkali-metal' },
  { atomicNumber: 20, symbol: 'Ca', name: 'Calcium', category: 'alkaline-earth' },
  { atomicNumber: 26, symbol: 'Fe', name: 'Iron', category: 'transition-metal' },
  { atomicNumber: 29, symbol: 'Cu', name: 'Copper', category: 'transition-metal' },
  { atomicNumber: 30, symbol: 'Zn', name: 'Zinc', category: 'transition-metal' },
  { atomicNumber: 35, symbol: 'Br', name: 'Bromine', category: 'nonmetal' },
  { atomicNumber: 36, symbol: 'Kr', name: 'Krypton', category: 'noble-gas' },
  { atomicNumber: 47, symbol: 'Ag', name: 'Silver', category: 'transition-metal' },
  { atomicNumber: 53, symbol: 'I', name: 'Iodine', category: 'nonmetal' },
  { atomicNumber: 54, symbol: 'Xe', name: 'Xenon', category: 'noble-gas' },
  { atomicNumber: 79, symbol: 'Au', name: 'Gold', category: 'transition-metal' },
  { atomicNumber: 80, symbol: 'Hg', name: 'Mercury', category: 'transition-metal' },
  { atomicNumber: 82, symbol: 'Pb', name: 'Lead', category: 'post-transition' },
  { atomicNumber: 86, symbol: 'Rn', name: 'Radon', category: 'noble-gas' },
];

export const PeriodicTableInteractive: React.FC = () => {
  const [selectedElement, setSelectedElement] = React.useState<ElementProps | null>(null);

  const handleElementClick = (element: ElementProps) => {
    setSelectedElement(element);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Interactive Periodic Table</h2>
        
        <div className="mb-6">
          <div className="flex items-center justify-center">
            <Table2 className="h-12 w-12 text-chemistry-blue mb-2" />
            <h3 className="text-lg font-medium ml-2">Periodic Table Explorer</h3>
          </div>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-4">
            Explore elements, their properties, and relationship patterns across the periodic table of elements.
            Click on any element to view more details.
          </p>
        </div>

        {selectedElement && (
          <div className="bg-white p-4 rounded-lg shadow mb-6 border border-chemistry-blue">
            <div className="flex items-start">
              <div className={`p-4 rounded-md mr-4 ${elementCategories[selectedElement.category as keyof typeof elementCategories]}`}>
                <div className="text-3xl font-bold">{selectedElement.symbol}</div>
                <div className="text-xs">{selectedElement.atomicNumber}</div>
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedElement.name}</h3>
                <p className="text-sm capitalize text-gray-600 mb-2">Category: {selectedElement.category.replace("-", " ")}</p>
                <p className="text-sm text-gray-600">
                  {selectedElement.name} is {
                    selectedElement.category === 'nonmetal' ? 'a nonmetal element with unique properties.' :
                    selectedElement.category === 'noble-gas' ? 'a noble gas with a full valence electron shell.' :
                    selectedElement.category === 'alkali-metal' ? 'a highly reactive metal found in group 1.' :
                    selectedElement.category === 'alkaline-earth' ? 'a reactive metal found in group 2.' :
                    selectedElement.category === 'transition-metal' ? 'a metal with multiple oxidation states.' :
                    selectedElement.category === 'metalloid' ? 'an element with properties of both metals and nonmetals.' :
                    'an element with interesting chemical properties.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-18 gap-1">
          {/* First row */}
          <ElementTile {...periodicTableElements[0]} onClick={() => handleElementClick(periodicTableElements[0])} />
          <div className="col-span-7 sm:col-span-9 md:col-span-11 lg:col-span-16"></div>
          <ElementTile {...periodicTableElements[1]} onClick={() => handleElementClick(periodicTableElements[1])} />
          
          {/* Second row */}
          <ElementTile {...periodicTableElements[2]} onClick={() => handleElementClick(periodicTableElements[2])} />
          <ElementTile {...periodicTableElements[3]} onClick={() => handleElementClick(periodicTableElements[3])} />
          <div className="col-span-5 sm:col-span-7 md:col-span-9 lg:col-span-10"></div>
          <ElementTile {...periodicTableElements[4]} onClick={() => handleElementClick(periodicTableElements[4])} />
          <ElementTile {...periodicTableElements[5]} onClick={() => handleElementClick(periodicTableElements[5])} />
          <ElementTile {...periodicTableElements[6]} onClick={() => handleElementClick(periodicTableElements[6])} />
          <ElementTile {...periodicTableElements[7]} onClick={() => handleElementClick(periodicTableElements[7])} />
          <ElementTile {...periodicTableElements[8]} onClick={() => handleElementClick(periodicTableElements[8])} />
          <ElementTile {...periodicTableElements[9]} onClick={() => handleElementClick(periodicTableElements[9])} />
          
          {/* Third row */}
          <ElementTile {...periodicTableElements[10]} onClick={() => handleElementClick(periodicTableElements[10])} />
          <ElementTile {...periodicTableElements[11]} onClick={() => handleElementClick(periodicTableElements[11])} />
          <div className="col-span-5 sm:col-span-7 md:col-span-9 lg:col-span-10"></div>
          <ElementTile {...periodicTableElements[12]} onClick={() => handleElementClick(periodicTableElements[12])} />
          <ElementTile {...periodicTableElements[13]} onClick={() => handleElementClick(periodicTableElements[13])} />
          <ElementTile {...periodicTableElements[14]} onClick={() => handleElementClick(periodicTableElements[14])} />
          <ElementTile {...periodicTableElements[15]} onClick={() => handleElementClick(periodicTableElements[15])} />
          <ElementTile {...periodicTableElements[16]} onClick={() => handleElementClick(periodicTableElements[16])} />
          <ElementTile {...periodicTableElements[17]} onClick={() => handleElementClick(periodicTableElements[17])} />
          
          {/* Fourth row */}
          <ElementTile {...periodicTableElements[18]} onClick={() => handleElementClick(periodicTableElements[18])} />
          <ElementTile {...periodicTableElements[19]} onClick={() => handleElementClick(periodicTableElements[19])} />
          <ElementTile {...periodicTableElements[20]} onClick={() => handleElementClick(periodicTableElements[20])} />
          <div className="col-span-8 sm:col-span-6 md:col-span-8 lg:col-span-9"></div>
          <ElementTile {...periodicTableElements[21]} onClick={() => handleElementClick(periodicTableElements[21])} />
          <ElementTile {...periodicTableElements[22]} onClick={() => handleElementClick(periodicTableElements[22])} />
          <ElementTile {...periodicTableElements[23]} onClick={() => handleElementClick(periodicTableElements[23])} />
          <ElementTile {...periodicTableElements[24]} onClick={() => handleElementClick(periodicTableElements[24])} />
        </div>
        
        <div className="mt-6 grid grid-cols-5 gap-2">
          <div className="rounded p-2 bg-red-100 border border-red-300">
            <span className="text-xs font-medium">Alkali Metals</span>
          </div>
          <div className="rounded p-2 bg-orange-100 border border-orange-300">
            <span className="text-xs font-medium">Alkaline Earth</span>
          </div>
          <div className="rounded p-2 bg-yellow-100 border border-yellow-300">
            <span className="text-xs font-medium">Transition Metals</span>
          </div>
          <div className="rounded p-2 bg-green-100 border border-green-300">
            <span className="text-xs font-medium">Post-Transition</span>
          </div>
          <div className="rounded p-2 bg-teal-100 border border-teal-300">
            <span className="text-xs font-medium">Metalloids</span>
          </div>
          <div className="rounded p-2 bg-blue-100 border border-blue-300">
            <span className="text-xs font-medium">Nonmetals</span>
          </div>
          <div className="rounded p-2 bg-purple-100 border border-purple-300">
            <span className="text-xs font-medium">Noble Gases</span>
          </div>
          <div className="rounded p-2 bg-pink-100 border border-pink-300">
            <span className="text-xs font-medium">Lanthanides</span>
          </div>
          <div className="rounded p-2 bg-rose-100 border border-rose-300">
            <span className="text-xs font-medium">Actinides</span>
          </div>
        </div>
        
        <div className="mt-6 flex justify-center">
          <Button className="bg-chemistry-blue">
            Explore Full Periodic Table
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
