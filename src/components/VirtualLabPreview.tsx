
import React, { useState } from "react";
import { 
  BeakerIcon, 
  ArrowRight, 
  Play, 
  Pause, 
  RotateCw,
  Droplet 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export const VirtualLabPreview = () => {
  const [temperature, setTemperature] = useState([25]);
  const [concentration, setConcentration] = useState([0.5]);
  const [isReacting, setIsReacting] = useState(false);
  const [reactionProgress, setReactionProgress] = useState(0);
  const [reactionColor, setReactionColor] = useState("bg-blue-200");

  // Handle the start/stop of the reaction
  const toggleReaction = () => {
    if (isReacting) {
      setIsReacting(false);
      return;
    }
    
    setIsReacting(true);
    setReactionProgress(0);
    setReactionColor("bg-blue-200");
    
    // Simulate a reaction over time
    const duration = 5000; // 5 seconds
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setReactionProgress(progress);
      
      // Change color based on reaction progress
      if (progress < 0.3) {
        setReactionColor("bg-blue-200");
      } else if (progress < 0.6) {
        setReactionColor("bg-purple-200");
      } else if (progress < 0.9) {
        setReactionColor("bg-pink-300");
      } else {
        setReactionColor("bg-red-300");
        if (progress >= 1) {
          setIsReacting(false);
          clearInterval(timer);
        }
      }
    }, interval);
  };

  // Reset the experiment
  const resetExperiment = () => {
    setIsReacting(false);
    setReactionProgress(0);
    setReactionColor("bg-blue-200");
    setTemperature([25]);
    setConcentration([0.5]);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      <div className="bg-chemistry-blue text-white px-4 py-2 flex justify-between items-center">
        <span className="font-medium">Virtual Titration Lab: Acid-Base Reaction</span>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-white" 
            onClick={resetExperiment}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <div className="md:col-span-2">
          <div className="relative aspect-video bg-gray-50 rounded-md border border-gray-200 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Lab equipment visualization */}
              <div className="relative w-48 h-64">
                {/* Flask */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-40">
                  <div className="absolute bottom-0 w-full h-32 bg-gray-200 rounded-b-full border-2 border-gray-300"></div>
                  <div className="absolute bottom-28 w-full h-8 bg-gray-200 rounded-t-lg border-2 border-x-2 border-t-2 border-gray-300"></div>
                  {/* Solution in flask */}
                  <div 
                    className={`absolute bottom-0 w-full h-24 ${reactionColor} rounded-b-full transition-all duration-500`}
                    style={{ opacity: 0.8 }}
                  ></div>
                </div>
                
                {/* Burette */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-40 bg-gray-100 border border-gray-300 rounded-b-lg">
                  {/* Burette solution */}
                  <div className="absolute top-0 w-full h-full bg-pink-100 rounded-b-lg" style={{ height: `${(1 - reactionProgress) * 100}%` }}></div>
                  {/* Burette tip */}
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-gray-300"></div>
                  {/* Drops */}
                  {isReacting && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                      <Droplet className="h-4 w-4 text-pink-200 fill-pink-200" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Overlay for reaction status */}
            <div className="absolute bottom-2 left-2 bg-white bg-opacity-80 rounded-md px-2 py-1 text-xs">
              {isReacting ? "Reaction in progress..." : "Ready for experiment"}
            </div>
            
            {/* Progress indicator */}
            {isReacting && (
              <div className="absolute bottom-2 right-2 w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-chemistry-blue transition-all" 
                  style={{ width: `${reactionProgress * 100}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
        
        <div className="md:col-span-1 space-y-4">
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
            <h4 className="text-sm font-medium mb-2">Experiment Controls</h4>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-gray-600">Temperature (°C)</label>
                  <span className="text-xs font-medium">{temperature[0]}°C</span>
                </div>
                <Slider
                  value={temperature}
                  min={15}
                  max={50}
                  step={1}
                  onValueChange={setTemperature}
                  disabled={isReacting}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-gray-600">Concentration (M)</label>
                  <span className="text-xs font-medium">{concentration[0]}M</span>
                </div>
                <Slider
                  value={concentration}
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  onValueChange={setConcentration}
                  disabled={isReacting}
                />
              </div>
              
              <Button 
                className="w-full" 
                onClick={toggleReaction}
                variant={isReacting ? "destructive" : "default"}
              >
                {isReacting ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    <span>Stop Reaction</span>
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    <span>Start Reaction</span>
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
            <h4 className="text-sm font-medium mb-2">Reaction Data</h4>
            <ul className="text-xs space-y-1.5">
              <li className="flex justify-between">
                <span className="text-gray-600">pH Level:</span>
                <span className="font-medium">{isReacting ? (7 - reactionProgress * 4).toFixed(1) : "7.0"}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Volume Added:</span>
                <span className="font-medium">{(reactionProgress * 25).toFixed(1)} mL</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Reaction Rate:</span>
                <span className="font-medium">
                  {isReacting 
                    ? `${(temperature[0] * concentration[0] * 0.4).toFixed(1)} mol/L·s`
                    : "0.0 mol/L·s"
                  }
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
