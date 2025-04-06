
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { BookOpen, BeakerIcon } from "lucide-react";

interface TheorySection {
  title: string;
  content: string;
  image_url?: string;
}

interface QuizItem {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

interface TheoryContentProps {
  sections: TheorySection[];
  quiz?: QuizItem[];
  navigateToInteractive: (title: string, contentType: string) => void;
  markExerciseAttempted: () => void;
  handleQuizOptionClick: (item: QuizItem, optionIndex: number) => void;
}

export const ModuleTheoryContent = ({
  sections,
  quiz,
  navigateToInteractive,
  markExerciseAttempted,
  handleQuizOptionClick,
}: TheoryContentProps) => {
  return (
    <div className="space-y-8">
      {sections.map((section: any, index: number) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-3">{section.title}</h3>
            
            {section.title.toLowerCase().includes("interactive") ? (
              <div className="flex flex-col md:flex-row gap-6">
                {section.image_url && (
                  <div className="md:w-1/3">
                    <div 
                      className="rounded-md overflow-hidden bg-gray-100 aspect-video flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity relative group"
                      onClick={() => {
                        navigateToInteractive(section.title, section.title.split(' ')[1].toLowerCase());
                        markExerciseAttempted();
                      }}
                    >
                      <img 
                        src={section.image_url} 
                        alt={section.title} 
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                      <div className="absolute inset-0 bg-chemistry-purple bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all">
                        <div className="bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all">
                          <ExternalLink className="h-5 w-5 text-chemistry-purple" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-center text-sm text-chemistry-purple font-medium">
                      Click to interact
                    </div>
                  </div>
                )}
                <div className={section.image_url ? "md:w-2/3" : "w-full"}>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
                    {section.content}
                  </p>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 text-chemistry-purple border-chemistry-purple hover:bg-chemistry-soft-purple"
                    onClick={() => {
                      navigateToInteractive(section.title, section.title.split(' ')[1].toLowerCase());
                      markExerciseAttempted();
                    }}
                  >
                    Try Interactive Example <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : section.title.toLowerCase().includes("real-life") ? (
              <div className="space-y-4">
                {section.image_url && (
                  <div className="rounded-md overflow-hidden bg-gray-100">
                    <img 
                      src={section.image_url} 
                      alt={section.title} 
                      className="object-cover w-full max-h-64"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                )}
                
                <div className="bg-chemistry-soft-purple p-4 rounded-lg">
                  <h4 className="font-medium text-chemistry-purple mb-2">Why This Matters</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">{section.content}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h5 className="text-sm font-medium mb-2">In Your Daily Life</h5>
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-chemistry-soft-purple flex items-center justify-center flex-shrink-0">
                          <BookOpen className="h-5 w-5 text-chemistry-purple" />
                        </div>
                        <p className="text-xs text-gray-600">
                          {section.title.includes("Atom") ? 
                            "Your smartphone uses atomic principles in its processor chips." : 
                          section.title.includes("Periodic") ? 
                            "Elements from the periodic table like aluminum are in soda cans and titanium in bikes." : 
                            "The chemical reactions you learn about explain why your food cooks and why soap cleans."}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h5 className="text-sm font-medium mb-2">Fun Fact</h5>
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <BeakerIcon className="h-5 w-5 text-chemistry-blue" />
                        </div>
                        <p className="text-xs text-gray-600">
                          {section.title.includes("Atom") ? 
                            "If an atom were the size of a sports stadium, its nucleus would be the size of a pea!" : 
                          section.title.includes("Periodic") ? 
                            "Helium was first discovered on the sun before it was found on Earth!" : 
                            "Your body performs thousands of chemical reactions every second without you noticing!"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-6">
                {section.image_url && (
                  <div className="md:w-1/3">
                    <div className="rounded-md overflow-hidden bg-gray-100 aspect-video flex items-center justify-center">
                      <img 
                        src={section.image_url} 
                        alt={section.title} 
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  </div>
                )}
                <div className={section.image_url ? "md:w-2/3" : "w-full"}>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {section.content}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {quiz && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Quick Check</h3>
            <div className="space-y-6">
              {quiz.map((item: any, index: number) => (
                <div key={index} className="border rounded-md p-4">
                  <p className="font-medium mb-3">{item.question}</p>
                  <div className="space-y-2">
                    {item.options.map((option: string, optionIndex: number) => (
                      <div 
                        key={optionIndex}
                        className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
                          optionIndex === item.correct_index ? "border-green-300 hover:bg-green-50" : ""
                        }`}
                        onClick={() => handleQuizOptionClick(item, optionIndex)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
