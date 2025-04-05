
import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ArrowLeft, ZoomIn, ZoomOut, RotateCw, MousePointerClick, ArrowRightLeft, Info, Play, Filter, Settings, BookOpen, Database, Beaker, Microscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Enhanced Element data with more properties
const elementsData = [
  { symbol: 'H', name: 'Hydrogen', atomicNumber: 1, category: 'nonmetal', color: 'bg-green-100', atomicWeight: '1.008', electronConfig: '1s¹', state: 'gas', group: 1, period: 1, density: '0.00009 g/cm³', meltingPoint: '-259.1°C', boilingPoint: '-252.9°C', discovered: '1766', uses: ['Fuel', 'Ammonia production', 'Oil refining'], funFact: 'Hydrogen is the lightest and most abundant element in the universe.' },
  { symbol: 'He', name: 'Helium', atomicNumber: 2, category: 'noble-gas', color: 'bg-purple-100', atomicWeight: '4.0026', electronConfig: '1s²', state: 'gas', group: 18, period: 1, density: '0.0001785 g/cm³', meltingPoint: 'N/A', boilingPoint: '-268.9°C', discovered: '1868', uses: ['Balloons', 'Cryogenics', 'MRI machines'], funFact: 'Helium is the only element discovered outside Earth before being found on Earth.' },
  { symbol: 'Li', name: 'Lithium', atomicNumber: 3, category: 'alkali-metal', color: 'bg-red-100', atomicWeight: '6.94', electronConfig: '[He] 2s¹', state: 'solid', group: 1, period: 2, density: '0.534 g/cm³', meltingPoint: '180.5°C', boilingPoint: '1342°C', discovered: '1817', uses: ['Batteries', 'Medications', 'Alloys'], funFact: 'Lithium is used in psychiatric medications and is the lightest metal.' },
  { symbol: 'Be', name: 'Beryllium', atomicNumber: 4, category: 'alkaline-earth', color: 'bg-orange-100', atomicWeight: '9.0122', electronConfig: '[He] 2s²', state: 'solid', group: 2, period: 2, density: '1.85 g/cm³', meltingPoint: '1287°C', boilingPoint: '2470°C', discovered: '1797', uses: ['Aerospace', 'Nuclear reactors', 'X-ray equipment'], funFact: 'Beryllium is transparent to X-rays and extremely lightweight yet strong.' },
  { symbol: 'B', name: 'Boron', atomicNumber: 5, category: 'metalloid', color: 'bg-yellow-100', atomicWeight: '10.81', electronConfig: '[He] 2s² 2p¹', state: 'solid', group: 13, period: 2, density: '2.34 g/cm³', meltingPoint: '2076°C', boilingPoint: '4000°C', discovered: '1808', uses: ['Glass', 'Detergents', 'Semiconductors'], funFact: 'Boron is essential for plant growth and is used in borosilicate glass like Pyrex.' },
  { symbol: 'C', name: 'Carbon', atomicNumber: 6, category: 'nonmetal', color: 'bg-green-100', atomicWeight: '12.011', electronConfig: '[He] 2s² 2p²', state: 'solid', group: 14, period: 2, density: '2.267 g/cm³ (graphite)', meltingPoint: '3550°C (graphite)', boilingPoint: '4827°C', discovered: 'Prehistoric', uses: ['Steel', 'Diamonds', 'Graphene'], funFact: 'Carbon forms the basis for all known life and has nearly 10 million known compounds.' },
  { symbol: 'N', name: 'Nitrogen', atomicNumber: 7, category: 'nonmetal', color: 'bg-green-100', atomicWeight: '14.007', electronConfig: '[He] 2s² 2p³', state: 'gas', group: 15, period: 2, density: '0.001251 g/cm³', meltingPoint: '-210.0°C', boilingPoint: '-195.8°C', discovered: '1772', uses: ['Fertilizers', 'Refrigeration', 'Explosives'], funFact: 'Nitrogen makes up about 78% of Earth\'s atmosphere.' },
  { symbol: 'O', name: 'Oxygen', atomicNumber: 8, category: 'nonmetal', color: 'bg-green-100', atomicWeight: '15.999', electronConfig: '[He] 2s² 2p⁴', state: 'gas', group: 16, period: 2, density: '0.001429 g/cm³', meltingPoint: '-218.8°C', boilingPoint: '-183.0°C', discovered: '1774', uses: ['Respiration', 'Steel production', 'Medicine'], funFact: 'Oxygen makes up about 21% of Earth\'s atmosphere and 65% of the human body by mass.' },
  { symbol: 'F', name: 'Fluorine', atomicNumber: 9, category: 'halogen', color: 'bg-teal-100', atomicWeight: '18.998', electronConfig: '[He] 2s² 2p⁵', state: 'gas', group: 17, period: 2, density: '0.001696 g/cm³', meltingPoint: '-219.6°C', boilingPoint: '-188.1°C', discovered: '1886', uses: ['Toothpaste', 'Teflon', 'Refrigerants'], funFact: 'Fluorine is the most reactive and electronegative of all elements.' },
  { symbol: 'Ne', name: 'Neon', atomicNumber: 10, category: 'noble-gas', color: 'bg-purple-100', atomicWeight: '20.180', electronConfig: '[He] 2s² 2p⁶', state: 'gas', group: 18, period: 2, density: '0.0008999 g/cm³', meltingPoint: '-248.6°C', boilingPoint: '-246.1°C', discovered: '1898', uses: ['Neon signs', 'Cryogenics', 'Lasers'], funFact: 'Neon signs actually only use neon gas for the red-orange glow; other colors use different gases.' },
  { symbol: 'Na', name: 'Sodium', atomicNumber: 11, category: 'alkali-metal', color: 'bg-red-100', atomicWeight: '22.990', electronConfig: '[Ne] 3s¹', state: 'solid', group: 1, period: 3, density: '0.968 g/cm³', meltingPoint: '97.8°C', boilingPoint: '883°C', discovered: '1807', uses: ['Table salt', 'Street lights', 'Chemicals'], funFact: 'Pure sodium metal reacts violently with water and must be stored in oil.' },
  { symbol: 'Mg', name: 'Magnesium', atomicNumber: 12, category: 'alkaline-earth', color: 'bg-orange-100', atomicWeight: '24.305', electronConfig: '[Ne] 3s²', state: 'solid', group: 2, period: 3, density: '1.738 g/cm³', meltingPoint: '650°C', boilingPoint: '1090°C', discovered: '1755', uses: ['Alloys', 'Fireworks', 'Supplements'], funFact: 'Magnesium burns with a brilliant white light and is used in fireworks and flash photography.' },
  { symbol: 'Al', name: 'Aluminum', atomicNumber: 13, category: 'post-transition', color: 'bg-blue-100', atomicWeight: '26.982', electronConfig: '[Ne] 3s² 3p¹', state: 'solid', group: 13, period: 3, density: '2.7 g/cm³', meltingPoint: '660.3°C', boilingPoint: '2519°C', discovered: '1827', uses: ['Aircraft', 'Packaging', 'Construction'], funFact: 'Aluminum was once more valuable than gold, despite being the most abundant metal in Earth\'s crust.' },
  { symbol: 'Si', name: 'Silicon', atomicNumber: 14, category: 'metalloid', color: 'bg-yellow-100', atomicWeight: '28.085', electronConfig: '[Ne] 3s² 3p²', state: 'solid', group: 14, period: 3, density: '2.33 g/cm³', meltingPoint: '1414°C', boilingPoint: '3265°C', discovered: '1824', uses: ['Electronics', 'Solar cells', 'Glass'], funFact: 'Silicon forms the backbone of modern computing and is the second most abundant element in Earth\'s crust after oxygen.' },
  { symbol: 'P', name: 'Phosphorus', atomicNumber: 15, category: 'nonmetal', color: 'bg-green-100', atomicWeight: '30.974', electronConfig: '[Ne] 3s² 3p³', state: 'solid', group: 15, period: 3, density: '1.82 g/cm³ (white)', meltingPoint: '44.1°C (white)', boilingPoint: '280.5°C (white)', discovered: '1669', uses: ['Fertilizers', 'Matches', 'Detergents'], funFact: 'White phosphorus glows in the dark when exposed to oxygen.' },
  { symbol: 'S', name: 'Sulfur', atomicNumber: 16, category: 'nonmetal', color: 'bg-green-100', atomicWeight: '32.06', electronConfig: '[Ne] 3s² 3p⁴', state: 'solid', group: 16, period: 3, density: '2.07 g/cm³', meltingPoint: '115.2°C', boilingPoint: '444.6°C', discovered: 'Prehistoric', uses: ['Gunpowder', 'Sulfuric acid', 'Vulcanization'], funFact: 'Sulfur has been known since ancient times and was called "brimstone" in biblical texts.' },
  { symbol: 'Cl', name: 'Chlorine', atomicNumber: 17, category: 'halogen', color: 'bg-teal-100', atomicWeight: '35.45', electronConfig: '[Ne] 3s² 3p⁵', state: 'gas', group: 17, period: 3, density: '0.003214 g/cm³', meltingPoint: '-101.5°C', boilingPoint: '-34.0°C', discovered: '1774', uses: ['Water purification', 'PVC', 'Disinfectants'], funFact: 'Chlorine was used as a chemical weapon in World War I but is now essential for clean drinking water.' },
  { symbol: 'Ar', name: 'Argon', atomicNumber: 18, category: 'noble-gas', color: 'bg-purple-100', atomicWeight: '39.948', electronConfig: '[Ne] 3s² 3p⁶', state: 'gas', group: 18, period: 3, density: '0.001784 g/cm³', meltingPoint: '-189.4°C', boilingPoint: '-185.8°C', discovered: '1894', uses: ['Light bulbs', 'Welding', 'Windows'], funFact: 'Argon makes up about 0.93% of Earth\'s atmosphere and is used in light bulbs to prevent the filament from burning out.' },
  { symbol: 'Fe', name: 'Iron', atomicNumber: 26, category: 'transition-metal', color: 'bg-blue-200', atomicWeight: '55.845', electronConfig: '[Ar] 3d⁶ 4s²', state: 'solid', group: 8, period: 4, density: '7.874 g/cm³', meltingPoint: '1538°C', boilingPoint: '2862°C', discovered: 'Prehistoric', uses: ['Steel', 'Construction', 'Tools'], funFact: 'Iron is the most common element on Earth by mass and forms much of Earth\'s core.' },
  { symbol: 'Cu', name: 'Copper', atomicNumber: 29, category: 'transition-metal', color: 'bg-blue-200', atomicWeight: '63.546', electronConfig: '[Ar] 3d¹⁰ 4s¹', state: 'solid', group: 11, period: 4, density: '8.96 g/cm³', meltingPoint: '1085°C', boilingPoint: '2562°C', discovered: 'Prehistoric', uses: ['Electrical wiring', 'Plumbing', 'Coins'], funFact: 'Copper was one of the first metals used by humans and gave its name to the Copper Age.' },
];

// Define the props interface for our component
interface ModuleInteractivePageProps {
  interactiveType?: 'molecule' | 'periodic-table' | 'chemical-reaction';
}

const ModuleInteractivePage = ({ interactiveType }: ModuleInteractivePageProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { interactiveId } = useParams();
  
  // Determine the type from props, params, or default to molecule
  let type = interactiveType || searchParams.get('type') || '';
  
  // Map route parameter to our internal type names
  if (type === 'periodic') type = 'periodic-table';
  if (!type || (type !== 'molecule' && type !== 'periodic-table' && type !== 'chemical-reaction')) {
    // Check URL path to determine type if not explicitly set
    const path = window.location.pathname;
    if (path.includes('periodic-table')) {
      type = 'periodic-table';
    } else if (path.includes('chemical-reaction')) {
      type = 'chemical-reaction';
    } else if (path.includes('molecule')) {
      type = 'molecule';
    } else {
      type = 'molecule'; // Default fallback
    }
  }
  
  console.log("ModuleInteractivePage type detection:", { 
    interactiveType, 
    searchParamType: searchParams.get('type'), 
    detectedType: type, 
    path: window.location.pathname 
  });
  
  const moduleId = searchParams.get('moduleId');
  
  // State for interactive elements
  const [rotating, setRotating] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [activeElement, setActiveElement] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  // For periodic table example
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'basic' | 'detailed'>('basic');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('properties');
  
  // For chemical reaction example
  const [reactionProgress, setReactionProgress] = useState(0);
  const [reactionStarted, setReactionStarted] = useState(false);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.6));
  };

  const toggleRotation = () => {
    setRotating(!rotating);
  };

  const handleElementClick = (element: string) => {
    setActiveElement(element === activeElement ? null : element);
  };
  
  const handleFilterChange = (category: string | null) => {
    setFilterCategory(category);
    
    // Show toast with filter info
    if (category) {
      toast({
        title: `Filtered by ${category}`,
        description: `Showing only ${category} elements`,
      });
    } else {
      toast({
        title: "Filter removed",
        description: "Showing all elements",
      });
    }
  };
  
  // Start automatic rotation on page load
  useEffect(() => {
    console.log("ModuleInteractivePage loaded with type:", type, "and ID:", interactiveId);
    setRotating(true);
    
    // Auto-show explanation
    setTimeout(() => {
      setIsOpen(true);
    }, 1500);
    
    // Show welcome toast
    toast({
      title: `Interactive ${type} Mode`,
      description: "Explore, interact, and learn with this interactive example!",
    });
    
    return () => {
      setRotating(false);
    };
  }, [type, interactiveId]);
  
  // For chemical reaction simulation
  useEffect(() => {
    if (reactionStarted && reactionProgress < 100) {
      const timer = setTimeout(() => {
        setReactionProgress(prev => Math.min(prev + 5, 100));
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [reactionStarted, reactionProgress]);

  const renderInteractiveContent = () => {
    switch (type) {
      case 'molecule':
        return (
          <Card>
            <CardContent className="p-6">
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <div className="bg-chemistry-purple text-white px-4 py-2 flex justify-between items-center">
                  <span className="font-medium">3D Molecule Viewer: Water (H₂O)</span>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-white" 
                      onClick={toggleRotation}
                    >
                      <RotateCw className={cn("h-4 w-4", rotating && "animate-spin")} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-white" 
                      onClick={handleZoomIn}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-white" 
                      onClick={handleZoomOut}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="relative aspect-video p-4 flex items-center justify-center bg-white">
                  <div 
                    className={cn(
                      "relative transition-transform", 
                      rotating && "animate-spin-slow"
                    )} 
                    style={{ transform: `scale(${zoom})` }}
                  >
                    {/* Simple Water Molecule Visualization */}
                    <div 
                      className="absolute w-10 h-10 bg-red-500 rounded-full top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer hover:brightness-110 transition-all"
                      onClick={() => handleElementClick('O')}
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-white font-bold">O</span>
                    </div>
                    <div 
                      className="absolute w-8 h-8 bg-blue-500 rounded-full bottom-4 left-0 transform -translate-x-1/2 z-10 cursor-pointer hover:brightness-110 transition-all"
                      onClick={() => handleElementClick('H1')}
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-white font-bold">H</span>
                    </div>
                    <div 
                      className="absolute w-8 h-8 bg-blue-500 rounded-full bottom-4 right-0 transform translate-x-1/2 z-10 cursor-pointer hover:brightness-110 transition-all"
                      onClick={() => handleElementClick('H2')}
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-white font-bold">H</span>
                    </div>
                    <div className="absolute w-16 h-1 bg-gray-400 rotate-[135deg] top-8 left-10"></div>
                    <div className="absolute w-16 h-1 bg-gray-400 rotate-[45deg] top-8 right-10"></div>
                  </div>
                  
                  <div className="absolute bottom-2 left-2 flex items-center space-x-1 text-xs text-gray-500">
                    <MousePointerClick className="h-3 w-3" />
                    <span>Click atoms for info</span>
                  </div>

                  <div className="absolute bottom-2 right-2 flex items-center space-x-1 text-xs text-gray-500">
                    <ArrowRightLeft className="h-3 w-3" />
                    <span>Use buttons to rotate & zoom</span>
                  </div>
                </div>
                
                {activeElement && (
                  <div className="p-3 bg-gray-50 border-t">
                    {activeElement === 'O' && (
                      <div className="text-sm">
                        <span className="font-semibold">Oxygen (O)</span>
                        <p>Atomic number: 8</p>
                        <p>Oxygen forms covalent bonds with hydrogen atoms in water.</p>
                      </div>
                    )}
                    {(activeElement === 'H1' || activeElement === 'H2') && (
                      <div className="text-sm">
                        <span className="font-semibold">Hydrogen (H)</span>
                        <p>Atomic number: 1</p>
                        <p>Water contains two hydrogen atoms bonded to oxygen at an angle of 104.5°.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4 bg-gray-100 p-3 rounded-lg">
                <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                  <CollapsibleTrigger className="flex w-full justify-between items-center text-sm font-medium">
                    <span>More about Water Molecule</span>
                    <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="text-sm mt-2">
                    <p>Water (H₂O) is a polar molecule with a bent shape due to the oxygen atom's two lone pairs of electrons.</p>
                    <p className="mt-2">The bond angle is approximately 104.5°, slightly less than the tetrahedral angle (109.5°) due to electron repulsion.</p>
                    <p className="mt-2">This molecular structure gives water its unique properties, including high surface tension and ability to dissolve many substances.</p>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-2">Did You Know?</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-chemistry-soft-purple p-3 rounded-md text-sm">
                    <p>Water covers about 71% of Earth's surface, yet less than 1% is accessible freshwater for drinking.</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-md text-sm">
                    <p>Water is the only substance that naturally exists in all three states of matter (solid, liquid, gas) on Earth's surface.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
        
      case 'periodic-table':
        return (
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <div className="bg-chemistry-purple text-white px-4 py-2 flex justify-between items-center">
                  <span className="font-medium">Interactive Periodic Table</span>
                  <div className="flex items-center space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-white" 
                            onClick={() => setViewMode(viewMode === 'basic' ? 'detailed' : 'basic')}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Toggle view mode</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-white"
                        >
                          <Filter className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-3">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Filter by category</h4>
                          <div className="grid grid-cols-1 gap-1">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className={cn(
                                "justify-start", 
                                filterCategory === null && "bg-primary text-primary-foreground"
                              )}
                              onClick={() => handleFilterChange(null)}
                            >
                              All Elements
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className={cn(
                                "justify-start", 
                                filterCategory === "metal" && "bg-primary text-primary-foreground"
                              )}
                              onClick={() => handleFilterChange("metal")}
                            >
                              Metals
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className={cn(
                                "justify-start", 
                                filterCategory === "nonmetal" && "bg-primary text-primary-foreground"
                              )}
                              onClick={() => handleFilterChange("nonmetal")}
                            >
                              Nonmetals
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className={cn(
                                "justify-start", 
                                filterCategory === "noble-gas" && "bg-primary text-primary-foreground"
                              )}
                              onClick={() => handleFilterChange("noble-gas")}
                            >
                              Noble Gases
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                    {elementsData
                      .filter(el => 
                        !filterCategory || 
                        (filterCategory === "metal" && ["alkali-metal", "alkaline-earth", "transition-metal", "post-transition"].includes(el.category)) ||
                        (filterCategory === "nonmetal" && ["nonmetal", "halogen", "metalloid"].includes(el.category)) ||
                        (filterCategory === el.category)
                      )
                      .map((element) => (
                        <TooltipProvider key={element.symbol}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={`${element.color} border p-2 aspect-square flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:shadow-md ${
                                  selectedElement === element.symbol ? 'ring-2 ring-chemistry-purple scale-105' : ''
                                }`}
                                onClick={() => setSelectedElement(element.symbol)}
                              >
                                <div className="text-xs">{element.atomicNumber}</div>
                                <div className="font-bold">{element.symbol}</div>
                                <div className="text-[8px] md:text-xs truncate">{element.name}</div>
                                {viewMode === 'detailed' && (
                                  <div className="text-[6px] md:text-[8px] mt-1 truncate">{element.atomicWeight}</div>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <div className="text-xs">
                                <p className="font-bold">{element.name} ({element.symbol})</p>
                                <p>Atomic Number: {element.atomicNumber}</p>
                                <p>State: {element.state}</p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                  </div>

                  {selectedElement && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="mt-4 border p-4 rounded-md hover:shadow-md transition-shadow cursor-pointer">
                          {(() => {
                            const element = elementsData.find(e => e.symbol === selectedElement);
                            if (!element) return null;
                            
                            return (
                              <div>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-bold text-lg">{element.name} ({element.symbol})</h3>
                                    <p className="text-sm mt-1">Atomic Number: {element.atomicNumber}</p>
                                  </div>
                                  <Button variant="outline" size="sm" className="gap-1">
                                    <Info className="h-3 w-3" /> Detailed View
                                  </Button>
                                </div>
                                
                                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                                  <div>Atomic Weight: {element.atomicWeight}</div>
                                  <div>State at Room Temp: {element.state}</div>
                                  <div>Electron Config: {element.electronConfig}</div>
                                  <div>Category: {element.category.replace('-', ' ')}</div>
                                </div>
                                
                                <div className="mt-3 text-xs bg-chemistry-soft-purple p-2 rounded">
                                  <p className="font-semibold">Fun Fact:</p>
                                  <p>{element.funFact}</p>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        {(() => {
                          const element = elementsData.find(e => e.symbol === selectedElement);
                          if (!element) return null;
                          
                          return (
                            <>
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-2xl">
                                  <span className={`${element.color} p-2 rounded`}>{element.symbol}</span> 
                                  {element.name} <span className="text-gray-400">({element.atomicNumber})</span>
                                </DialogTitle>
                                <DialogDescription>
                                  Category: {element.category.replace('-', ' ')} • Discovered: {element.discovered}
                                </DialogDescription>
                              </DialogHeader>
                              
                              <Tabs defaultValue="properties" onValueChange={setActiveTab} className="mt-4">
                                <TabsList className="grid grid-cols-4">
                                  <TabsTrigger value="properties">Properties</TabsTrigger>
                                  <TabsTrigger value="applications">Applications</TabsTrigger>
                                  <TabsTrigger value="history">History</TabsTrigger>
                                  <TabsTrigger value="visuals">Visuals</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="properties" className="bg-gray-50 p-4 rounded-md mt-2">
                                  <h4 className="font-medium text-sm mb-3">Physical & Chemical Properties</h4>
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="bg-white p-3 rounded shadow-sm">
                                      <p className="text-xs text-gray-500">Atomic Weight</p>
                                      <p className="font-medium">{element.atomicWeight}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded shadow-sm">
                                      <p className="text-xs text-gray-500">State at Room Temp</p>
                                      <p className="font-medium capitalize">{element.state}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded shadow-sm">
                                      <p className="text-xs text-gray-500">Electron Configuration</p>
                                      <p className="font-medium">{element.electronConfig}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded shadow-sm">
                                      <p className="text-xs text-gray-500">Density</p>
                                      <p className="font-medium">{element.density}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded shadow-sm">
                                      <p className="text-xs text-gray-500">Melting Point</p>
                                      <p className="font-medium">{element.meltingPoint}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded shadow-sm">
                                      <p className="text-xs text-gray-500">Boiling Point</p>
                                      <p className="font-medium">{element.boilingPoint}</p>
                                    </div>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="applications" className="bg-gray-50 p-4 rounded-md mt-2">
                                  <h4 className="font-medium text-sm mb-3">Common Applications & Uses</h4>
                                  <ul className="list-disc list-inside space-y-2">
                                    {element.uses && element.uses.map((use, index) => (
                                      <li key={index} className="text-sm">{use}</li>
                                    ))}
                                  </ul>
                                  <div className="mt-4 bg-blue-50 p-3 rounded text-sm">
                                    <p className="font-medium">Industry Significance</p>
                                    <p className="mt-1">
                                      {element.name} is widely used in various industries due to its unique properties.
                                    </p>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="history" className="bg-gray-50 p-4 rounded-md mt-2">
                                  <h4 className="font-medium text-sm mb-3">Historical Background</h4>
                                  <div className="space-y-3 text-sm">
                                    <div className="flex gap-2">
                                      <div className="bg-chemistry-soft-purple p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                                        <BookOpen className="h-4 w-4" />
                                      </div>
                                      <div>
                                        <p className="font-medium">Discovery</p>
                                        <p>Discovered in {element.discovered} {element.discovered !== 'Prehistoric' ? 'by scientists' : 'and used by ancient civilizations'}.</p>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <div className="bg-chemistry-soft-purple p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                                        <Database className="h-4 w-4" />
                                      </div>
                                      <div>
                                        <p className="font-medium">Etymology</p>
                                        <p>The name {element.name} comes from {element.name === 'Iron' ? 'the Anglo-Saxon word "isern"' : element.name === 'Copper' ? 'the Latin "cuprum"' : 'its historical origins'}.</p>
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="visuals" className="bg-gray-50 p-4 rounded-md mt-2">
                                  <h4 className="font-medium text-sm mb-3">Visual Representation</h4>
                                  <div className="flex flex-col md:flex-row gap-4">
                                    <div className="bg-white p-4 rounded shadow-sm flex-1">
                                      <p className="text-xs text-gray-500 mb-2">Atomic Structure</p>
                                      <div className="aspect-square flex items-center justify-center relative border rounded-full">
                                        <div className="h-8 w-8 rounded-full bg-chemistry-purple flex items-center justify-center text-white font-bold">
                                          {element.symbol}
                                        </div>
                                        <div className="absolute inset-0 border border-dashed rounded-full animate-ping-slow opacity-50"></div>
                                      </div>
                                    </div>
                                    <div className="bg-white p-4 rounded shadow-sm flex-1">
                                      <p className="text-xs text-gray-500 mb-2">Element Appearance</p>
                                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-300 rounded flex items-center justify-center text-lg font-bold">
                                        {element.state === 'gas' ? 'Gas' : element.state === 'liquid' ? 'Liquid' : 'Solid'}
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </>
                          );
                        })()}
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
        
      case 'chemical-reaction':
        return (
          <Card>
            <CardContent className="p-6">
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <div className="bg-chemistry-purple text-white px-4 py-2 flex justify-between items-center">
                  <span className="font-medium">Chemical Reaction Simulator</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-white" 
                    onClick={() => setReactionStarted(!reactionStarted)}
                    disabled={reactionProgress === 100}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-6 bg-white">
                  <h3 className="font-medium text-center mb-4">Hydrogen + Oxygen → Water</h3>
                  <div className="flex items-center justify-between max-w-lg mx-auto">
                    <div className="text-center">
                      <div className="flex gap-1 mb-2">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">H</div>
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">H</div>
                      </div>
                      <div className="text-xs">Hydrogen (H₂)</div>
                    </div>
                    
                    <div className="text-2xl font-bold">+</div>
                    
                    <div className="text-center">
                      <div className="flex gap-1 mb-2">
                        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">O</div>
                        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">O</div>
                      </div>
                      <div className="text-xs">Oxygen (O₂)</div>
                    </div>
                    
                    <div className="text-2xl font-bold">→</div>
                    
                    <div className="text-center">
                      <div className="flex gap-1 mb-2">
                        <div className="relative w-12 h-16">
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">O</div>
                          <div className="absolute bottom-0 left-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">H</div>
                          <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">H</div>
                        </div>
                      </div>
                      <div className="text-xs">Water (H₂O)</div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Reaction Progress</span>
                      <span>{reactionProgress}%</span>
                    </div>
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-chemistry-purple transition-all duration-300 ease-out"
                        style={{ width: `${reactionProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm">
                    <p className="font-medium">Reaction Details:</p>
                    <p className="mt-1">2 H₂ + O₂ → 2 H₂O</p>
                    <p className="mt-1">This is an exothermic reaction, meaning it releases energy in the form of heat.</p>
                    
                    {reactionProgress > 30 && (
                      <div className="mt-3 p-2 bg-yellow-50 rounded text-xs animate-fade-in">
                        <p className="font-medium">Observation:</p>
                        <p>The molecules are colliding and forming new bonds!</p>
                      </div>
                    )}
                    
                    {reactionProgress > 70 && (
                      <div className="mt-3 p-2 bg-blue-50 rounded text-xs animate-fade-in">
                        <p className="font-medium">Result:</p>
                        <p>Water molecules are forming as hydrogen and oxygen atoms rearrange.</p>
                      </div>
                    )}
                    
                    {reactionProgress === 100 && (
                      <div className="mt-3 p-2 bg-green-50 rounded text-xs animate-fade-in">
                        <p className="font-medium">Reaction Complete!</p>
                        <p>The hydrogen and oxygen have fully combined to form water.</p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mt-2"
                          onClick={() => {
                            setReactionProgress(0);
                            setReactionStarted(false);
                          }}
                        >
                          Reset Reaction
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 bg-gray-100 p-3 rounded-lg">
                <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                  <CollapsibleTrigger className="flex w-full justify-between items-center text-sm font-medium">
                    <span>More about this Reaction</span>
                    <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="text-sm mt-2">
                    <p>The reaction between hydrogen and oxygen to form water is a fundamental chemical reaction in chemistry.</p>
                    <p className="mt-2">This reaction releases a large amount of energy and is the same reaction that powers hydrogen fuel cells.</p>
                    <p className="mt-2">When hydrogen and oxygen combine rapidly with a spark, the reaction can be explosive - this is why the Hindenburg airship disaster was so devastating.</p>
                  </CollapsibleContent>
                </Collapsible>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Real-World Applications</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 rounded-md bg-chemistry-soft-purple text-sm">
                    <div className="flex gap-2 items-start">
                      <div className="p-2 rounded-full bg-white">
                        <Beaker className="h-4 w-4 text-chemistry-purple" />
                      </div>
                      <div>
                        <p className="font-medium">Hydrogen Fuel Cells</p>
                        <p className="mt-1">These devices use the reaction between hydrogen and oxygen to generate electricity, with water as the only byproduct.</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-md bg-blue-50 text-sm">
                    <div className="flex gap-2 items-start">
                      <div className="p-2 rounded-full bg-white">
                        <Microscope className="h-4 w-4 text-blue-700" />
                      </div>
                      <div>
                        <p className="font-medium">Water Synthesis</p>
                        <p className="mt-1">This reaction is used in laboratory settings to produce highly pure water for experiments and research.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
        
      default:
        return (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">Interactive Example</h3>
                <p className="text-gray-500 mb-6">Select a specific interactive example type to explore.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    onClick={() => navigate('/molecule/example')}
                  >
                    <div className="w-10 h-10 rounded-full bg-chemistry-soft-purple flex items-center justify-center">
                      <Beaker className="h-5 w-5 text-chemistry-purple" />
                    </div>
                    <span>3D Molecule</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    onClick={() => navigate('/periodic-table/example')}
                  >
                    <div className="w-10 h-10 rounded-full bg-chemistry-soft-purple flex items-center justify-center">
                      <Database className="h-5 w-5 text-chemistry-purple" />
                    </div>
                    <span>Periodic Table</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    onClick={() => navigate('/chemical-reaction/example')}
                  >
                    <div className="w-10 h-10 rounded-full bg-chemistry-soft-purple flex items-center justify-center">
                      <Microscope className="h-5 w-5 text-chemistry-purple" />
                    </div>
                    <span>Chemical Reaction</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <h1 className="text-2xl font-bold">{type === 'molecule' ? '3D Molecule Viewer' : type === 'periodic-table' ? 'Interactive Periodic Table' : 'Chemical Reaction Simulator'}</h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
        
        {renderInteractiveContent()}
      </div>
    </Layout>
  );
};

export default ModuleInteractivePage;
