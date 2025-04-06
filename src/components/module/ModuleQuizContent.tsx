
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuizQuestion {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

interface QuizContentProps {
  introduction: string;
  questions: QuizQuestion[];
  handleQuizOptionClick: (question: QuizQuestion, optionIndex: number, questionIndex: number) => void;
  handleQuizComplete: () => void;
}

export const ModuleQuizContent = ({
  introduction,
  questions,
  handleQuizOptionClick,
  handleQuizComplete,
}: QuizContentProps) => {
  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-3">Quiz Introduction</h3>
          <p className="text-gray-700 leading-relaxed">{introduction}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Questions</h3>
          
          <div className="space-y-8">
            {questions.map((question: QuizQuestion, index: number) => (
              <div key={index} className="border rounded-md p-5">
                <p className="font-medium mb-4">{`${index + 1}. ${question.question}`}</p>
                
                <div className="space-y-3">
                  {question.options.map((option: string, optionIndex: number) => (
                    <div 
                      key={optionIndex}
                      className="p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                      onClick={() => handleQuizOptionClick(question, optionIndex, index)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8">
            <Button
              className="bg-chemistry-purple hover:bg-chemistry-blue"
              onClick={handleQuizComplete}
            >
              Submit Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
