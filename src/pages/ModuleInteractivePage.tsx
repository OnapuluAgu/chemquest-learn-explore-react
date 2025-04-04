
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
  const type = interactiveType || searchParams.get('type') || 'molecule';
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
    setRotating(true);
    
    // Auto-show explanation
    setTimeout(() => {
      setIsOpen(true);
    }, 1500);
    
    // Show welcome toast
    toast({
      title: "Interactive Mode",
      description: "Explore, interact, and learn with this interactive example!",
    });
    
    return () => {
      setRotating(false);
    };
  }, []);
  
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
        
      case 'periodic':
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
                                      <p className="font-medium">{element.atomicWeight} u</p>
                                    </div>
                                    <div className="bg-white p-3 rounded shadow-sm">
                                      <p className="text-xs text-gray-500">Electron Configuration</p>
                                      <p className="font-medium">{element.electronConfig}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded shadow-sm">
                                      <p className="text-xs text-gray-500">State at Room Temperature</p>
                                      <p className="font-medium capitalize">{element.state}</p>
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
                                    <div className="bg-white p-3 rounded shadow-sm">
                                      <p className="text-xs text-gray-500">Group</p>
                                      <p className="font-medium">{element.group}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded shadow-sm">
                                      <p className="text-xs text-gray-500">Period</p>
                                      <p className="font-medium">{element.period}</p>
                                    </div>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="applications" className="bg-gray-50 p-4 rounded-md mt-2">
                                  <h4 className="font-medium text-sm mb-3">Common Uses & Applications</h4>
                                  <div className="space-y-3">
                                    <p className="text-sm">Primary applications of {element.name}:</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                      {element.uses.map((use, index) => (
                                        <li key={index} className="text-sm">{use}</li>
                                      ))}
                                    </ul>
                                    
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div className="bg-chemistry-soft-purple p-3 rounded-md">
                                        <h5 className="text-sm font-medium mb-1 flex items-center gap-1">
                                          <Beaker className="h-4 w-4" /> Scientific Applications
                                        </h5>
                                        <p className="text-xs">
                                          {element.name} is used in various scientific fields, including research, analysis, and experimentation.
                                        </p>
                                      </div>
                                      <div className="bg-blue-50 p-3 rounded-md">
                                        <h5 className="text-sm font-medium mb-1 flex items-center gap-1">
                                          <BookOpen className="h-4 w-4" /> Educational Value
                                        </h5>
                                        <p className="text-xs">
                                          Understanding {element.name} helps students learn about atomic structure, chemical bonding, and properties of matter.
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <div className="mt-3 bg-white p-3 rounded-md shadow-sm border">
                                      <h5 className="text-sm font-medium mb-1">Real-World Example:</h5>
                                      <p className="text-xs">
                                        {element.symbol === 'O' && "Oxygen is essential for respiration in most living organisms and makes up about 21% of Earth's atmosphere."}
                                        {element.symbol === 'C' && "Carbon is the fundamental element in all organic compounds and is the basis for all life on Earth."}
                                        {element.symbol === 'H' && "Hydrogen is being explored as a clean energy source that produces only water when burned."}
                                        {element.symbol !== 'O' && element.symbol !== 'C' && element.symbol !== 'H' && `${element.name} has unique properties that make it valuable in various applications and industries.`}
                                      </p>
                                    </div>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="history" className="bg-gray-50 p-4 rounded-md mt-2">
                                  <h4 className="font-medium text-sm mb-3">Historical Context & Discovery</h4>
                                  <div className="space-y-4">
                                    <div className="bg-white p-3 rounded shadow-sm">
                                      <p className="text-xs text-gray-500">Discovered</p>
                                      <p className="font-medium">{element.discovered}</p>
                                    </div>
                                    
                                    <div className="bg-white p-3 rounded shadow-sm">
                                      <h5 className="text-sm font-medium mb-1">Discovery Story</h5>
                                      <p className="text-xs">
                                        {element.symbol === 'O' && "Oxygen was independently discovered by Carl Wilhelm Scheele in 1771 and Joseph Priestley in 1774. Antoine Lavoisier later named it 'oxygen' meaning 'acid-former' in Greek."}
                                        {element.symbol === 'C' && "Carbon has been known since prehistoric times in the form of charcoal, soot, and coal. Antoine Lavoisier listed carbon as an element in 1789."}
                                        {element.symbol === 'H' && "Henry Cavendish first recognized hydrogen as a distinct element in 1766, though Robert Boyle had produced it earlier. Antoine Lavoisier gave it the name 'hydrogen' meaning 'water-former'."}
                                        {element.symbol !== 'O' && element.symbol !== 'C' && element.symbol !== 'H' && `${element.name} was discovered in ${element.discovered}. Its unique properties have made it important throughout scientific history.`}
                                      </p>
                                    </div>
                                    
                                    <div className="bg-white p-3 rounded shadow-sm">
                                      <h5 className="text-sm font-medium mb-1">Name Origin</h5>
                                      <p className="text-xs">
                                        {element.symbol === 'O' && "The name 'oxygen' comes from the Greek words 'oxys' (acid) and 'genes' (creator), meaning 'acid-former'."}
                                        {element.symbol === 'C' && "The name 'carbon' comes from the Latin word 'carbo', meaning charcoal."}
                                        {element.symbol === 'H' && "The name 'hydrogen' comes from the Greek words 'hydro' (water) and 'genes' (creator), meaning 'water-former'."}
                                        {element.symbol === 'He' && "The name 'helium' comes from the Greek word 'helios', meaning sun, as it was first detected in the sun's spectrum."}
                                        {element.symbol === 'Fe' && "The symbol 'Fe' comes from the Latin word 'ferrum', meaning iron."}
                                        {element.symbol !== 'O' && element.symbol !== 'C' && element.symbol !== 'H' && element.symbol !== 'He' && element.symbol !== 'Fe' && `${element.name} has a rich linguistic history behind its naming.`}
                                      </p>
                                    </div>
                                    
                                    <div className="mt-3 bg-chemistry-soft-purple p-3 rounded-md">
                                      <h5 className="text-sm font-medium mb-1 flex items-center gap-1">
                                        <Info className="h-4 w-4" /> Fun Fact
                                      </h5>
                                      <p className="text-xs">{element.funFact}</p>
                                    </div>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="visuals" className="bg-gray-50 p-4 rounded-md mt-2 text-center">
                                  <h4 className="font-medium text-sm mb-3">Visual Representation</h4>
                                  
                                  <div className="bg-white rounded-lg border p-4 mx-auto mb-4 max-w-md">
                                    <div className="flex justify-center mb-4">
                                      <div className={`${element.color} p-6 rounded-full w-32 h-32 flex items-center justify-center shadow-lg`}>
                                        <div className="text-center">
                                          <div className="text-sm">{element.atomicNumber}</div>
                                          <div className="text-4xl font-bold">{element.symbol}</div>
                                          <div className="text-xs">{element.atomicWeight}</div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <p className="text-xs mb-4">This is an artistic representation of the {element.name} atom. In reality, atoms are too small to see with the naked eye.</p>
                                    
                                    <div className="bg-gray-50 p-3 rounded text-xs text-left">
                                      <p className="mb-2">In a classroom setting, you might visualize {element.name} through:</p>
                                      <ul className="list-disc pl-5 space-y-1">
                                        <li>3D molecular models</li>
                                        <li>Laboratory experiments showing its properties</li>
                                        <li>Interactive simulations of atomic structure</li>
                                        <li>Videos demonstrating its real-world applications</li>
                                      </ul>
                                    </div>
                                  </div>
                                  
                                  <Button variant="outline" size="sm" className="gap-1">
                                    <Play className="h-3 w-3" /> Watch Video Demonstration
                                  </Button>
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
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Element Categories</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-100"></div>
                    <span>Alkali Metals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-100"></div>
                    <span>Alkaline Earth Metals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-200"></div>
                    <span>Transition Metals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-100"></div>
                    <span>Post-Transition Metals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-100"></div>
                    <span>Metalloids</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100"></div>
                    <span>Nonmetals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-teal-100"></div>
                    <span>Halogens</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-100"></div>
                    <span>Noble Gases</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
                <h4 className="font-medium mb-3">Learning Resources</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded shadow-sm flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium">Periodic Trends</h5>
                      <p className="text-xs text-gray-600">Learn about patterns in element properties</p>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded">
                      <Microscope className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium">Chemistry Labs</h5>
                      <p className="text-xs text-gray-600">Virtual experiments with elements</p>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded">
                      <Database className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium">Element Database</h5>
                      <p className="text-xs text-gray-600">Comprehensive data on all elements</p>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded">
                      <Play className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium">Video Tutorials</h5>
                      <p className="text-xs text-gray-600">Visual explanations of chemical concepts</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-sm bg-chemistry-soft-purple p-3 rounded">
                  <p className="font-medium mb-1">Did You Know?</p>
                  <p className="text-xs">The periodic table is arranged by increasing atomic number, but also groups elements with similar properties in columns. This organization helps predict how elements will behave in chemical reactions.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
        
      case 'reaction':
        return (
          <Card>
            <CardContent className="p-6">
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <div className="bg-chemistry-purple text-white px-4 py-2">
                  <span className="font-medium">Chemical Reaction Simulation</span>
                </div>
                <div className="p-4 bg-white">
                  <div className="text-center mb-4">
                    <h3 className="font-semibold text-lg">Neutralization Reaction</h3>
                    <p className="text-sm text-gray-600">HCl + NaOH → NaCl + H₂O</p>
                  </div>
                  
                  <div className="flex items-center justify-center gap-8 mb-6">
                    <div className="text-center">
                      <div className="h-32 w-24 rounded-md border flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-x-0 bottom-0 bg-red-300 transition-all duration-500" style={{ height: `${100 - reactionProgress}%` }}></div>
                        <span className="relative font-medium text-gray-700">HCl</span>
                      </div>
                      <p className="text-xs mt-1">Hydrochloric Acid</p>
                    </div>
                    
                    <div className="text-lg font-bold">+</div>
                    
                    <div className="text-center">
                      <div className="h-32 w-24 rounded-md border flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-x-0 bottom-0 bg-blue-300 transition-all duration-500" style={{ height: `${100 - reactionProgress}%` }}></div>
                        <span className="relative font-medium text-gray-700">NaOH</span>
                      </div>
                      <p className="text-xs mt-1">Sodium Hydroxide</p>
                    </div>
                    
                    <div className="text-lg font-bold">→</div>
                    
                    <div className="text-center">
                      <div className="h-32 w-24 rounded-md border flex items-center justify-center relative overflow-hidden">
                        <div 
                          className="absolute inset-x-0 bottom-0 bg-purple-200 transition-all duration-500" 
                          style={{ height: `${reactionProgress}%` }}
                        ></div>
                        <span className="relative font-medium text-gray-700">Products</span>
                      </div>
                      <p className="text-xs mt-1">NaCl + H₂O</p>
                    </div>
                  </div>
                  
                  <div className="text-center mb-4">
                    <Button
                      className="bg-chemistry-purple hover:bg-chemistry-blue"
                      onClick={() => {
                        setReactionStarted(true);
                        if (reactionProgress === 100) {
                          setReactionProgress(0);
                          setTimeout(() => setReactionStarted(true), 300);
                        }
                      }}
                    >
                      {reactionProgress === 0 ? "Start Reaction" : reactionProgress === 100 ? "Reset" : "Reaction in Progress..."}
                    </Button>
                  </div>
                  
                  <div className="mt-4 border-t pt-4">
                    <h4 className="font-medium mb-2">Reaction Progress</h4>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-chemistry-purple h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${reactionProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>0%</span>
                      <span>{reactionProgress}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-gray-50 p-3 rounded-md text-sm">
                    <h4 className="font-medium mb-1">What's Happening?</h4>
                    {reactionProgress === 0 && (
                      <p>Press "Start Reaction" to see what happens when an acid and base are mixed.</p>
                    )}
                    {reactionProgress > 0 && reactionProgress < 50 && (
                      <p>The acid (HCl) and base (NaOH) are starting to react. Hydrogen ions from the acid are combining with hydroxide ions from the base.</p>
                    )}
                    {reactionProgress >= 50 && reactionProgress < 100 && (
                      <p>The reaction is progressing, forming salt (NaCl) and water (H₂O). The neutralization is releasing heat.</p>
                    )}
                    {reactionProgress === 100 && (
                      <div>
                        <p>The reaction is complete! The acid and base have fully neutralized each other.</p>
                        <p className="mt-2">HCl + NaOH → NaCl + H₂O</p>
                        <p className="mt-2">This is called a neutralization reaction. The products are salt (sodium chloride) and water.</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-chemistry-soft-purple p-3 rounded-md">
                      <h5 className="text-sm font-medium mb-1">Real-Life Application</h5>
                      <p className="text-xs">Acid-base neutralization is used in antacids to relieve heartburn by neutralizing excess stomach acid.</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-md">
                      <h5 className="text-sm font-medium mb-1">Fun Fact</h5>
                      <p className="text-xs">You can test if a reaction is complete using pH indicators that change color based on acidity/alkalinity!</p>
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
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Interactive Example</h3>
                <p>Select a specific interactive example type to explore.</p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-6">
            <Link to={moduleId ? `/module/${moduleId}` : "/courses"} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Module
            </Link>
          </Button>
          
          <h1 className="text-3xl font-bold mb-4">Interactive Learning</h1>
          <p className="text-gray-600">Explore concepts through hands-on interactive examples.</p>
        </div>
        
        <div className="mb-8">
          <div className="flex space-x-2 mb-6">
            <Button 
              variant={type === 'molecule' ? 'default' : 'outline'} 
              onClick={() => navigate(`/module-interactive?type=molecule${moduleId ? `&moduleId=${moduleId}` : ''}`)}
              className={type === 'molecule' ? 'bg-chemistry-purple hover:bg-chemistry-blue' : ''}
            >
              3D Molecule
            </Button>
            <Button 
              variant={type === 'periodic' ? 'default' : 'outline'} 
              onClick={() => navigate(`/module-interactive?type=periodic${moduleId ? `&moduleId=${moduleId}` : ''}`)}
              className={type === 'periodic' ? 'bg-chemistry-purple hover:bg-chemistry-blue' : ''}
            >
              Periodic Table
            </Button>
            <Button 
              variant={type === 'reaction' ? 'default' : 'outline'} 
              onClick={() => navigate(`/module-interactive?type=reaction${moduleId ? `&moduleId=${moduleId}` : ''}`)}
              className={type === 'reaction' ? 'bg-chemistry-purple hover:bg-chemistry-blue' : ''}
            >
              Chemical Reaction
            </Button>
          </div>
        
          {renderInteractiveContent()}
        </div>
      </div>
    </Layout>
  );
};

export default ModuleInteractivePage;
