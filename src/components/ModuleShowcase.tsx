import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BeakerIcon, 
  BookOpenIcon, 
  Dna, 
  FlaskConical, 
  Lightbulb, 
  Zap, 
  RotateCw, 
  ZoomIn,
  ZoomOut,
  MousePointerClick,
  ArrowRightLeft
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { VirtualLabPreview } from "./VirtualLabPreview";
import { QuizPreview } from "./QuizPreview";
import { useNavigate } from "react-router-dom";

export const ModuleShowcase = () => {
  const [rotating, setRotating] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [activeElement, setActiveElement] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

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

  const navigateToInteractive = (type: string, title: string) => {
    const formattedTitle = title.toLowerCase().replace(/\s+/g, '-');
    
    switch (type.toLowerCase()) {
      case 'molecule':
        navigate(`/interactive/molecule/${formattedTitle}`);
        break;
      case 'periodic-table':
        navigate(`/interactive/periodic-table/${formattedTitle}`);
        break;
      case 'chemical-reaction':
        navigate(`/interactive/chemical-reaction/${formattedTitle}`);
        break;
      default:
        navigate(`/module-interactive/${formattedTitle}?type=${type}`);
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Interactive Learning Experience</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ChemQuest modules are designed to engage multiple learning styles through interactive content,
            simulations, and assessments. See examples of our approach below.
          </p>
        </div>

        <Tabs defaultValue="interactive" className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="interactive" className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Interactive Lessons</span>
              </TabsTrigger>
              <TabsTrigger value="simulations" className="flex items-center space-x-2">
                <FlaskConical className="h-4 w-4" />
                <span>Virtual Labs</span>
              </TabsTrigger>
              <TabsTrigger value="quizzes" className="flex items-center space-x-2">
                <Lightbulb className="h-4 w-4" />
                <span>Smart Quizzes</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="interactive" className="animate-fade-in">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/2">
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
                        <div className={cn(
                          "relative transition-transform", 
                          rotating && "animate-spin-slow",
                          `scale-${Math.round(zoom * 10) / 10}`.replace('.', '-')
                        )} 
                        style={{ transform: `scale(${zoom})` }}
                        >
                          <div className="absolute w-10 h-10 bg-red-500 rounded-full top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                            <span className="absolute inset-0 flex items-center justify-center text-white font-bold cursor-pointer"
                              onClick={() => handleElementClick('O')}
                            >O</span>
                          </div>
                          <div className="absolute w-8 h-8 bg-blue-500 rounded-full bottom-4 left-0 transform -translate-x-1/2 z-10">
                            <span className="absolute inset-0 flex items-center justify-center text-white font-bold cursor-pointer"
                              onClick={() => handleElementClick('H1')}
                            >H</span>
                          </div>
                          <div className="absolute w-8 h-8 bg-blue-500 rounded-full bottom-4 right-0 transform translate-x-1/2 z-10">
                            <span className="absolute inset-0 flex items-center justify-center text-white font-bold cursor-pointer"
                              onClick={() => handleElementClick('H2')}
                            >H</span>
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
                          <span>Drag to rotate manually</span>
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
                  </div>

                  <div className="md:w-1/2">
                    <h3 className="text-xl font-semibold mb-4">Engaging Interactive Content</h3>
                    <p className="text-gray-600 mb-4">
                      Our interactive lessons combine text, visuals, and manipulable elements that respond
                      to your actions, making complex chemistry concepts easier to understand.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 bg-chemistry-soft-purple rounded-full p-1">
                          <Dna className="h-4 w-4 text-chemistry-purple" />
                        </div>
                        <span className="text-gray-700">3D molecule viewers to explore chemical structures</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 bg-chemistry-soft-purple rounded-full p-1">
                          <Dna className="h-4 w-4 text-chemistry-purple" />
                        </div>
                        <span className="text-gray-700">Interactive periodic table with element details</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 bg-chemistry-soft-purple rounded-full p-1">
                          <Dna className="h-4 w-4 text-chemistry-purple" />
                        </div>
                        <span className="text-gray-700">Step-by-step equation balancing with instant feedback</span>
                      </li>
                    </ul>

                    <div className="mt-6 p-4 bg-chemistry-soft-purple rounded-lg">
                      <h4 className="font-medium text-chemistry-purple mb-2">Explore Interactive Examples</h4>
                      <p className="text-sm text-gray-700 mb-4">
                        Click to experience our interactive learning tools:
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Button 
                          variant="outline" 
                          className="border-chemistry-purple text-chemistry-purple hover:bg-chemistry-soft-purple"
                          onClick={() => navigateToInteractive('molecule', '3D Molecule Explorer')}
                        >
                          3D Molecule
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-chemistry-purple text-chemistry-purple hover:bg-chemistry-soft-purple"
                          onClick={() => navigateToInteractive('periodic-table', 'Periodic Table')}
                        >
                          Periodic Table
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-chemistry-purple text-chemistry-purple hover:bg-chemistry-soft-purple"
                          onClick={() => navigateToInteractive('chemical-reaction', 'Chemical Reaction')}
                        >
                          Chemical Reaction
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="simulations" className="animate-fade-in">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/2">
                    <VirtualLabPreview />
                  </div>
                  <div className="md:w-1/2">
                    <h3 className="text-xl font-semibold mb-4">Safe Virtual Lab Environment</h3>
                    <p className="text-gray-600 mb-4">
                      Experiment safely with our virtual labs. Mix chemicals, observe reactions,
                      and learn from outcomes without the risks of a physical laboratory.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 bg-blue-100 rounded-full p-1">
                          <FlaskConical className="h-4 w-4 text-chemistry-blue" />
                        </div>
                        <span className="text-gray-700">Titration experiments with color changes</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 bg-blue-100 rounded-full p-1">
                          <FlaskConical className="h-4 w-4 text-chemistry-blue" />
                        </div>
                        <span className="text-gray-700">Gas law simulations with adjustable variables</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 bg-blue-100 rounded-full p-1">
                          <FlaskConical className="h-4 w-4 text-chemistry-blue" />
                        </div>
                        <span className="text-gray-700">Reaction rate experiments with data analysis</span>
                      </li>
                    </ul>
                    
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-chemistry-blue mb-2">Try it yourself!</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        In the virtual lab preview, you can:
                      </p>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-center">
                          <span className="bg-chemistry-blue text-white rounded-full w-5 h-5 inline-flex items-center justify-center mr-2">1</span>
                          <span>Adjust temperature and concentration sliders</span>
                        </li>
                        <li className="flex items-center">
                          <span className="bg-chemistry-blue text-white rounded-full w-5 h-5 inline-flex items-center justify-center mr-2">2</span>
                          <span>Start the reaction to observe color changes</span>
                        </li>
                        <li className="flex items-center">
                          <span className="bg-chemistry-blue text-white rounded-full w-5 h-5 inline-flex items-center justify-center mr-2">3</span>
                          <span>Monitor reaction data in real-time</span>
                        </li>
                        <li className="flex items-center">
                          <span className="bg-chemistry-blue text-white rounded-full w-5 h-5 inline-flex items-center justify-center mr-2">4</span>
                          <span>Reset the experiment to try different parameters</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quizzes" className="animate-fade-in">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/2">
                    <QuizPreview />
                  </div>
                  <div className="md:w-1/2">
                    <h3 className="text-xl font-semibold mb-4">Personalized Assessment</h3>
                    <p className="text-gray-600 mb-4">
                      Test your knowledge with varied question types and receive instant,
                      personalized feedback to guide your learning journey.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 bg-amber-100 rounded-full p-1">
                          <Lightbulb className="h-4 w-4 text-amber-700" />
                        </div>
                        <span className="text-gray-700">Multiple choice, drag-and-drop, and calculation questions</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 bg-amber-100 rounded-full p-1">
                          <Lightbulb className="h-4 w-4 text-amber-700" />
                        </div>
                        <span className="text-gray-700">Instant feedback with explanations for wrong answers</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 bg-amber-100 rounded-full p-1">
                          <Lightbulb className="h-4 w-4 text-amber-700" />
                        </div>
                        <span className="text-gray-700">Progress tracking to identify areas for improvement</span>
                      </li>
                    </ul>
                    
                    <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                      <h4 className="font-medium text-amber-700 mb-2">Try it yourself!</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        In this quiz preview, you can:
                      </p>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-center">
                          <span className="bg-amber-600 text-white rounded-full w-5 h-5 inline-flex items-center justify-center mr-2">1</span>
                          <span>Answer multiple-choice chemistry questions</span>
                        </li>
                        <li className="flex items-center">
                          <span className="bg-amber-600 text-white rounded-full w-5 h-5 inline-flex items-center justify-center mr-2">2</span>
                          <span>Receive instant feedback on your answers</span>
                        </li>
                        <li className="flex items-center">
                          <span className="bg-amber-600 text-white rounded-full w-5 h-5 inline-flex items-center justify-center mr-2">3</span>
                          <span>Learn from detailed explanations for each question</span>
                        </li>
                        <li className="flex items-center">
                          <span className="bg-amber-600 text-white rounded-full w-5 h-5 inline-flex items-center justify-center mr-2">4</span>
                          <span>Track your progress through the sample quiz</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
