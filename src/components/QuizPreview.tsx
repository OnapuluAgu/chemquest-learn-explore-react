
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Progress } from "@/components/ui/progress";
import { Check, X, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

type QuestionType = {
  id: number;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
};

export const QuizPreview = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const form = useForm({
    defaultValues: {
      answer: "",
    },
  });

  const questions: QuestionType[] = [
    {
      id: 1,
      question: "Which of the following is NOT a state of matter?",
      options: [
        { id: "a", text: "Solid" },
        { id: "b", text: "Liquid" },
        { id: "c", text: "Gas" },
        { id: "d", text: "Molecule" },
      ],
      correctAnswer: "d",
      explanation:
        "Molecule is not a state of matter. The three common states of matter are solid, liquid, and gas. Plasma is sometimes considered the fourth state.",
    },
    {
      id: 2,
      question: "What is the chemical formula for water?",
      options: [
        { id: "a", text: "H₂O" },
        { id: "b", text: "CO₂" },
        { id: "c", text: "NaCl" },
        { id: "d", text: "CH₄" },
      ],
      correctAnswer: "a",
      explanation:
        "Water's chemical formula is H₂O, representing two hydrogen atoms bonded to one oxygen atom.",
    },
    {
      id: 3,
      question: "Which element has the atomic number 6?",
      options: [
        { id: "a", text: "Hydrogen" },
        { id: "b", text: "Oxygen" },
        { id: "c", text: "Carbon" },
        { id: "d", text: "Nitrogen" },
      ],
      correctAnswer: "c",
      explanation:
        "Carbon has an atomic number of 6, meaning it has 6 protons in its nucleus.",
    },
  ];

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleSubmit = form.handleSubmit((data) => {
    const answer = data.answer;
    const correct = answer === currentQ.correctAnswer;
    
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setShowExplanation(true);
    
    if (correct) {
      setScore(score + 1);
    }
  });

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
      setSelectedAnswer(null);
      setIsCorrect(null);
      form.reset();
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setShowExplanation(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setQuizCompleted(false);
    setScore(0);
    form.reset();
  };

  return (
    <div className="bg-gray-100 rounded-lg overflow-hidden">
      <div className="bg-amber-600 text-white px-4 py-2 flex justify-between items-center">
        <span className="font-medium">Chemistry Quiz: Fundamentals</span>
        <div className="text-sm">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      <div className="p-4">
        <Progress value={progress} className="mb-4" />

        {!quizCompleted ? (
          <>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">{currentQ.question}</h3>
              
              <Form {...form}>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="answer"
                    render={({ field }) => (
                      <FormItem>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-2"
                          disabled={showExplanation}
                        >
                          {currentQ.options.map((option) => (
                            <div
                              key={option.id}
                              className={cn(
                                "flex items-center space-x-2 rounded-md border p-3",
                                showExplanation && option.id === currentQ.correctAnswer
                                  ? "border-green-500 bg-green-50"
                                  : showExplanation && option.id === selectedAnswer && option.id !== currentQ.correctAnswer
                                  ? "border-red-500 bg-red-50"
                                  : "border-gray-200"
                              )}
                            >
                              <RadioGroupItem value={option.id} id={option.id} />
                              <Label
                                htmlFor={option.id}
                                className="flex-1 cursor-pointer"
                              >
                                {option.text}
                              </Label>
                              {showExplanation && option.id === currentQ.correctAnswer && (
                                <Check className="h-5 w-5 text-green-500" />
                              )}
                              {showExplanation && option.id === selectedAnswer && option.id !== currentQ.correctAnswer && (
                                <X className="h-5 w-5 text-red-500" />
                              )}
                            </div>
                          ))}
                        </RadioGroup>
                        
                        {!showExplanation && (
                          <Button type="submit" className="mt-4 bg-amber-600 hover:bg-amber-700 w-full">
                            Submit Answer
                          </Button>
                        )}
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>

            {showExplanation && (
              <div className="mb-4">
                <div className={cn(
                  "p-3 rounded-md flex items-start space-x-3",
                  isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                )}>
                  <div className={cn(
                    "p-1 rounded-full mt-0.5",
                    isCorrect ? "bg-green-100" : "bg-red-100"
                  )}>
                    {isCorrect ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className={cn(
                      "font-medium",
                      isCorrect ? "text-green-800" : "text-red-800"
                    )}>
                      {isCorrect ? "Correct!" : "Incorrect"}
                    </p>
                    <div className="mt-1 flex items-start space-x-2">
                      <Lightbulb className="h-4 w-4 text-amber-600 mt-0.5" />
                      <p className="text-sm text-gray-700">{currentQ.explanation}</p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleNext} 
                  className="mt-4 bg-amber-600 hover:bg-amber-700 w-full"
                >
                  {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-4">
            <h3 className="text-xl font-bold mb-2">Quiz Completed!</h3>
            <p className="text-gray-600 mb-4">
              You scored {score} out of {questions.length}
            </p>
            <div className="w-32 h-32 mx-auto mb-4 relative">
              <div className="w-full h-full rounded-full bg-amber-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-amber-600">
                  {Math.round((score / questions.length) * 100)}%
                </span>
              </div>
            </div>
            <Button onClick={handleRetry} className="bg-amber-600 hover:bg-amber-700">
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
