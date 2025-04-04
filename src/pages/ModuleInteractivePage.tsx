
import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ArrowLeft, ZoomIn, ZoomOut, RotateCw, MousePointerClick, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "@/components/ui/use-toast";

const ModuleInteractivePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = searchParams.get('type') || 'molecule';
  const moduleId = searchParams.get('moduleId');
  
  // State for interactive elements
  const [rotating, setRotating] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [activeElement, setActiveElement] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  // For periodic table example
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  
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
          <Card>
            <CardContent className="p-6">
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <div className="bg-chemistry-purple text-white px-4 py-2">
                  <span className="font-medium">Interactive Periodic Table</span>
                </div>
                <div className="p-4 bg-white">
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                    {/* This is a simplified periodic table with just a few representative elements */}
                    {[
                      { symbol: 'H', name: 'Hydrogen', atomicNumber: 1, category: 'nonmetal', color: 'bg-green-100' },
                      { symbol: 'He', name: 'Helium', atomicNumber: 2, category: 'noble-gas', color: 'bg-purple-100' },
                      { symbol: 'Li', name: 'Lithium', atomicNumber: 3, category: 'alkali-metal', color: 'bg-red-100' },
                      { symbol: 'Be', name: 'Beryllium', atomicNumber: 4, category: 'alkaline-earth', color: 'bg-orange-100' },
                      { symbol: 'B', name: 'Boron', atomicNumber: 5, category: 'metalloid', color: 'bg-yellow-100' },
                      { symbol: 'C', name: 'Carbon', atomicNumber: 6, category: 'nonmetal', color: 'bg-green-100' },
                      { symbol: 'N', name: 'Nitrogen', atomicNumber: 7, category: 'nonmetal', color: 'bg-green-100' },
                      { symbol: 'O', name: 'Oxygen', atomicNumber: 8, category: 'nonmetal', color: 'bg-green-100' },
                      { symbol: 'F', name: 'Fluorine', atomicNumber: 9, category: 'halogen', color: 'bg-teal-100' },
                      { symbol: 'Ne', name: 'Neon', atomicNumber: 10, category: 'noble-gas', color: 'bg-purple-100' },
                      { symbol: 'Na', name: 'Sodium', atomicNumber: 11, category: 'alkali-metal', color: 'bg-red-100' },
                      { symbol: 'Mg', name: 'Magnesium', atomicNumber: 12, category: 'alkaline-earth', color: 'bg-orange-100' },
                      { symbol: 'Al', name: 'Aluminum', atomicNumber: 13, category: 'post-transition', color: 'bg-blue-100' },
                      { symbol: 'Si', name: 'Silicon', atomicNumber: 14, category: 'metalloid', color: 'bg-yellow-100' },
                      { symbol: 'P', name: 'Phosphorus', atomicNumber: 15, category: 'nonmetal', color: 'bg-green-100' },
                      { symbol: 'S', name: 'Sulfur', atomicNumber: 16, category: 'nonmetal', color: 'bg-green-100' },
                      { symbol: 'Cl', name: 'Chlorine', atomicNumber: 17, category: 'halogen', color: 'bg-teal-100' },
                      { symbol: 'Ar', name: 'Argon', atomicNumber: 18, category: 'noble-gas', color: 'bg-purple-100' },
                      { symbol: 'Fe', name: 'Iron', atomicNumber: 26, category: 'transition-metal', color: 'bg-blue-200' },
                      { symbol: 'Cu', name: 'Copper', atomicNumber: 29, category: 'transition-metal', color: 'bg-blue-200' },
                    ].map((element) => (
                      <div
                        key={element.symbol}
                        className={`${element.color} border p-2 aspect-square flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:shadow-md ${
                          selectedElement === element.symbol ? 'ring-2 ring-chemistry-purple' : ''
                        }`}
                        onClick={() => setSelectedElement(element.symbol)}
                      >
                        <div className="text-xs">{element.atomicNumber}</div>
                        <div className="font-bold">{element.symbol}</div>
                        <div className="text-[8px] md:text-xs truncate">{element.name}</div>
                      </div>
                    ))}
                  </div>

                  {selectedElement && (
                    <div className="mt-4 border p-4 rounded-md">
                      {selectedElement === 'H' && (
                        <div>
                          <h3 className="font-bold">Hydrogen (H)</h3>
                          <p className="text-sm mt-1">The lightest element. Commonly found in water and organic compounds.</p>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                            <div>Atomic Number: 1</div>
                            <div>Atomic Mass: 1.008 u</div>
                            <div>Category: Nonmetal</div>
                            <div>State: Gas</div>
                          </div>
                          <p className="mt-2 text-xs bg-green-50 p-2 rounded">Used in fuel cells, petroleum refining, and as a potential clean energy source.</p>
                        </div>
                      )}
                      {selectedElement === 'O' && (
                        <div>
                          <h3 className="font-bold">Oxygen (O)</h3>
                          <p className="text-sm mt-1">Essential for respiration and combustion. Makes up about 21% of Earth's atmosphere.</p>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                            <div>Atomic Number: 8</div>
                            <div>Atomic Mass: 15.999 u</div>
                            <div>Category: Nonmetal</div>
                            <div>State: Gas</div>
                          </div>
                          <p className="mt-2 text-xs bg-green-50 p-2 rounded">Used in medicine, steel production, and is essential for all aerobic life.</p>
                        </div>
                      )}
                      {/* Add similar blocks for other elements... simplified for brevity */}
                      {selectedElement !== 'H' && selectedElement !== 'O' && (
                        <div>
                          <h3 className="font-bold">{
                            [
                              { symbol: 'He', name: 'Helium' },
                              { symbol: 'Li', name: 'Lithium' },
                              { symbol: 'Be', name: 'Beryllium' },
                              { symbol: 'B', name: 'Boron' },
                              { symbol: 'C', name: 'Carbon' },
                              { symbol: 'N', name: 'Nitrogen' },
                              { symbol: 'F', name: 'Fluorine' },
                              { symbol: 'Ne', name: 'Neon' },
                              { symbol: 'Na', name: 'Sodium' },
                              { symbol: 'Mg', name: 'Magnesium' },
                              { symbol: 'Al', name: 'Aluminum' },
                              { symbol: 'Si', name: 'Silicon' },
                              { symbol: 'P', name: 'Phosphorus' },
                              { symbol: 'S', name: 'Sulfur' },
                              { symbol: 'Cl', name: 'Chlorine' },
                              { symbol: 'Ar', name: 'Argon' },
                              { symbol: 'Fe', name: 'Iron' },
                              { symbol: 'Cu', name: 'Copper' },
                            ].find(e => e.symbol === selectedElement)?.name || ''
                          } ({selectedElement})</h3>
                          <p className="text-sm mt-1">Click on different elements to learn more about them!</p>
                          <div className="mt-2 text-xs bg-chemistry-soft-purple p-2 rounded">
                            <p>Each element has its own unique properties and uses, stemming from its atomic structure.</p>
                            <p className="mt-1">The periodic table organizes elements by atomic number and similar properties.</p>
                          </div>
                        </div>
                      )}
                    </div>
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
              onClick={() => navigate(`/module-interactive/water-molecule?type=molecule${moduleId ? `&moduleId=${moduleId}` : ''}`)}
              className={type === 'molecule' ? 'bg-chemistry-purple hover:bg-chemistry-blue' : ''}
            >
              3D Molecule
            </Button>
            <Button 
              variant={type === 'periodic' ? 'default' : 'outline'} 
              onClick={() => navigate(`/module-interactive/periodic-table?type=periodic${moduleId ? `&moduleId=${moduleId}` : ''}`)}
              className={type === 'periodic' ? 'bg-chemistry-purple hover:bg-chemistry-blue' : ''}
            >
              Periodic Table
            </Button>
            <Button 
              variant={type === 'reaction' ? 'default' : 'outline'} 
              onClick={() => navigate(`/module-interactive/chemical-reaction?type=reaction${moduleId ? `&moduleId=${moduleId}` : ''}`)}
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
