
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AtomIcon, BookOpen, Beaker, GraduationCap } from "lucide-react";

export const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-chemistry-purple to-chemistry-blue text-white">
      {/* Background Elements - Molecules */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="molecule-icon animate-float absolute top-20 left-[10%]">
          <div className="atom atom-1"></div>
          <div className="atom atom-2"></div>
          <div className="atom atom-3"></div>
          <div className="bond bond-1"></div>
          <div className="bond bond-2"></div>
        </div>
        <div className="molecule-icon animate-float animation-delay-1000 absolute top-40 right-[15%]">
          <div className="atom atom-1"></div>
          <div className="atom atom-2"></div>
          <div className="atom atom-3"></div>
          <div className="bond bond-1"></div>
          <div className="bond bond-2"></div>
        </div>
        <div className="molecule-icon animate-float animation-delay-2000 absolute bottom-20 left-[20%]">
          <div className="atom atom-1"></div>
          <div className="atom atom-2"></div>
          <div className="atom atom-3"></div>
          <div className="bond bond-1"></div>
          <div className="bond bond-2"></div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Make Chemistry Learning 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-chemistry-soft-purple"> Interactive</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-100">
              ChemQuest transforms chemistry education with interactive modules, 
              virtual labs, and gamified learning. Experience a new way to master 
              chemical concepts.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button asChild size="lg" className="bg-white text-chemistry-purple hover:bg-chemistry-soft-purple">
                <Link to="/courses">Explore Courses</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0 hidden md:block">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-chemistry-light-purple to-chemistry-cyan rounded-lg blur opacity-75"></div>
              <div className="relative bg-white p-6 rounded-lg shadow-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-chemistry-soft-purple p-4 rounded-lg flex items-center space-x-3">
                    <div className="bg-chemistry-purple rounded-full p-2 text-white">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium text-chemistry-dark-purple">Interactive Modules</h3>
                      <p className="text-sm text-chemistry-purple">Learn at your pace</p>
                    </div>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-lg flex items-center space-x-3">
                    <div className="bg-chemistry-blue rounded-full p-2 text-white">
                      <Beaker className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Virtual Labs</h3>
                      <p className="text-sm text-chemistry-blue">Experiment safely</p>
                    </div>
                  </div>
                  <div className="bg-amber-100 p-4 rounded-lg flex items-center space-x-3">
                    <div className="bg-amber-500 rounded-full p-2 text-white">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Assessment</h3>
                      <p className="text-sm text-amber-700">Test your knowledge</p>
                    </div>
                  </div>
                  <div className="bg-green-100 p-4 rounded-lg flex items-center space-x-3">
                    <div className="bg-green-500 rounded-full p-2 text-white">
                      <AtomIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">3D Molecules</h3>
                      <p className="text-sm text-green-700">Visualize structures</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
