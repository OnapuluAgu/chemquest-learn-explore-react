
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { ArrowLeft, BookOpen, FlaskConicalIcon, GraduationCapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { getModuleById, getCourseById, updateUserModuleProgress } from "@/lib/api";

const ModuleDetailPage = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [currentProgress, setCurrentProgress] = useState(0);
  
  if (!moduleId) {
    return <div>Module ID is required</div>;
  }

  const { 
    data: module, 
    isLoading: isLoadingModule 
  } = useQuery({
    queryKey: ['module', moduleId],
    queryFn: () => getModuleById(moduleId),
    enabled: !!moduleId
  });

  const { 
    data: course, 
    isLoading: isLoadingCourse 
  } = useQuery({
    queryKey: ['course', module?.course_id],
    queryFn: () => getCourseById(module?.course_id || ''),
    enabled: !!module?.course_id
  });

  useEffect(() => {
    if (module) {
      // Update progress when first viewing the module (10%)
      const initialProgress = 10;
      updateUserModuleProgress(moduleId, initialProgress)
        .then(result => {
          if (result) {
            setCurrentProgress(result.progress || initialProgress);
          }
        })
        .catch(error => {
          console.error("Error updating initial progress:", error);
        });
    }
  }, [module, moduleId]);

  const updateProgress = (newProgress: number) => {
    setCurrentProgress(newProgress);
    updateUserModuleProgress(moduleId, newProgress)
      .then(() => {
        if (newProgress >= 100) {
          toast({
            title: "Module Completed!",
            description: "You've successfully completed this module.",
            variant: "default",
          });
        }
      })
      .catch(error => {
        console.error("Error updating progress:", error);
        toast({
          title: "Error Updating Progress",
          description: "There was a problem updating your progress.",
          variant: "destructive",
        });
      });
  };

  const renderModuleIcon = () => {
    switch (module?.type) {
      case 'lab':
        return <FlaskConicalIcon className="h-5 w-5" />;
      case 'quiz':
        return <GraduationCapIcon className="h-5 w-5" />;
      case 'theory':
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const renderModuleContent = () => {
    if (!module) return null;

    switch (module.type) {
      case 'theory': {
        const sections = module.content.sections || [];
        return (
          <div className="space-y-8">
            {sections.map((section: any, index: number) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{section.title}</h3>
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
                </CardContent>
              </Card>
            ))}

            {module.content.quiz && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Quick Check</h3>
                  <div className="space-y-6">
                    {module.content.quiz.map((item: any, index: number) => (
                      <div key={index} className="border rounded-md p-4">
                        <p className="font-medium mb-3">{item.question}</p>
                        <div className="space-y-2">
                          {item.options.map((option: string, optionIndex: number) => (
                            <div 
                              key={optionIndex}
                              className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
                                optionIndex === item.correct_index ? "border-green-300 hover:bg-green-50" : ""
                              }`}
                              onClick={() => {
                                // Increment progress for answering a question
                                const progressIncrement = 20;
                                const newProgress = Math.min(currentProgress + progressIncrement, 100);
                                updateProgress(newProgress);
                                
                                // Show correct answer feedback
                                if (optionIndex === item.correct_index) {
                                  toast({
                                    title: "Correct!",
                                    description: item.explanation,
                                    variant: "default",
                                  });
                                } else {
                                  toast({
                                    title: "Incorrect",
                                    description: `The correct answer is: ${item.options[item.correct_index]}. ${item.explanation}`,
                                    variant: "default",
                                  });
                                }
                              }}
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

            <div className="flex justify-between pt-4">
              <Button variant="outline" asChild>
                <Link to={`/course/${module.course_id}`} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back to Course
                </Link>
              </Button>
              
              <Button 
                className="bg-chemistry-purple hover:bg-chemistry-blue"
                onClick={() => {
                  // Mark as 100% complete when explicitly clicking complete
                  updateProgress(100);
                }}
              >
                Mark as Complete
              </Button>
            </div>
          </div>
        );
      }
      
      case 'lab': {
        const lab = module.content;
        return (
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">Introduction</h3>
                <p className="text-gray-700 leading-relaxed">{lab.introduction}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">{lab.experiment.title}</h3>
                <p className="text-gray-700 mb-4">{lab.experiment.description}</p>
                
                {lab.experiment.image_url && (
                  <div className="rounded-md overflow-hidden bg-gray-100 max-h-80 my-4">
                    <img 
                      src={lab.experiment.image_url} 
                      alt={lab.experiment.title} 
                      className="object-contain w-full max-h-80"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                )}
                
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Procedure:</h4>
                  <ol className="list-decimal list-inside space-y-2 pl-2">
                    {lab.experiment.steps.map((step: string, index: number) => (
                      <li key={index} className="text-gray-700">{step}</li>
                    ))}
                  </ol>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Real-life Connection:</h4>
                  <p className="text-gray-700">{lab.real_life_connection}</p>
                </div>
                
                <div className="mt-6">
                  <Button
                    className="bg-chemistry-purple hover:bg-chemistry-blue"
                    onClick={() => {
                      // Increment progress for completing the lab section
                      const newProgress = Math.min(currentProgress + 50, 100);
                      updateProgress(newProgress);
                      
                      toast({
                        title: "Lab Experiment Completed",
                        description: "Great job completing this virtual lab experiment!",
                        variant: "default",
                      });
                    }}
                  >
                    Complete Lab Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" asChild>
                <Link to={`/course/${module.course_id}`} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back to Course
                </Link>
              </Button>
              
              <Button 
                className="bg-chemistry-purple hover:bg-chemistry-blue"
                onClick={() => {
                  // Mark as 100% complete when explicitly clicking complete
                  updateProgress(100);
                }}
              >
                Mark as Complete
              </Button>
            </div>
          </div>
        );
      }
      
      case 'quiz': {
        const quiz = module.content;
        return (
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">Quiz Introduction</h3>
                <p className="text-gray-700 leading-relaxed">{quiz.introduction}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Questions</h3>
                
                <div className="space-y-8">
                  {quiz.questions.map((question: any, index: number) => (
                    <div key={index} className="border rounded-md p-5">
                      <p className="font-medium mb-4">{`${index + 1}. ${question.question}`}</p>
                      
                      <div className="space-y-3">
                        {question.options.map((option: string, optionIndex: number) => (
                          <div 
                            key={optionIndex}
                            className="p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                              // Calculate progress based on question completion
                              const totalQuestions = quiz.questions.length;
                              const progressPerQuestion = 100 / totalQuestions;
                              
                              // We'll set progress based on questions answered
                              const progressForThisQuestion = (index + 1) * progressPerQuestion;
                              const newProgress = Math.min(progressForThisQuestion, 100);
                              
                              updateProgress(newProgress);
                              
                              // Show the result toast
                              if (optionIndex === question.correct_index) {
                                toast({
                                  title: "Correct!",
                                  description: question.explanation,
                                  variant: "default",
                                });
                              } else {
                                toast({
                                  title: "Incorrect",
                                  description: `The correct answer is: ${question.options[question.correct_index]}. ${question.explanation}`,
                                  variant: "default",
                                });
                              }
                            }}
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
                    onClick={() => {
                      // Mark as complete
                      updateProgress(100);
                      
                      toast({
                        title: "Quiz Completed!",
                        description: "Great job completing this quiz!",
                        variant: "default",
                      });
                    }}
                  >
                    Submit Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" asChild>
                <Link to={`/course/${module.course_id}`} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back to Course
                </Link>
              </Button>
            </div>
          </div>
        );
      }
      
      default:
        return <div>Unsupported module type</div>;
    }
  };

  // Show loading state
  if (isLoadingModule || isLoadingCourse) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12 flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-chemistry-purple"></div>
        </div>
      </Layout>
    );
  }

  // Show error state if no module found
  if (!module) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-2xl font-bold mb-4">Module Not Found</h1>
          <p className="mb-6">The module you're looking for doesn't exist or you don't have access to it.</p>
          <Button asChild variant="outline">
            <Link to="/courses">Browse Courses</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <div className="flex items-center mb-6">
          <Link to={`/course/${module.course_id}`} className="text-chemistry-purple hover:underline">
            {course?.title || 'Course'}
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium">Module {module.order_index}</span>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">{module.title}</h1>
            <p className="text-gray-600 mt-2">{module.description}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className={`p-2 rounded-md ${
              module.type === 'theory' ? "bg-chemistry-soft-purple text-chemistry-purple" :
              module.type === 'lab' ? "bg-blue-100 text-chemistry-blue" :
              "bg-amber-100 text-amber-800"
            }`}>
              {renderModuleIcon()}
            </div>
            <span className="capitalize">{module.type}</span>
            <span className="mx-2">•</span>
            <span>{module.estimated_minutes} min</span>
            <span className="mx-2">•</span>
            <span>{module.points} pts</span>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Your Progress</span>
            <span>{currentProgress}%</span>
          </div>
          <Progress value={currentProgress} className="h-2" />
        </div>

        <Separator className="mb-8" />
        
        {renderModuleContent()}
      </div>
    </Layout>
  );
};

export default ModuleDetailPage;
