
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BeakerIcon, BookOpenIcon, Dna, FlaskConical, Lightbulb, Zap } from "lucide-react";

export const ModuleShowcase = () => {
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
                    <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
                      <BookOpenIcon className="h-16 w-16 text-gray-400" />
                      <span className="ml-2 text-gray-500">Interactive Module Preview</span>
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
                    <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
                      <BeakerIcon className="h-16 w-16 text-gray-400" />
                      <span className="ml-2 text-gray-500">Virtual Lab Preview</span>
                    </div>
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
                    <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
                      <Lightbulb className="h-16 w-16 text-gray-400" />
                      <span className="ml-2 text-gray-500">Quiz Preview</span>
                    </div>
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
