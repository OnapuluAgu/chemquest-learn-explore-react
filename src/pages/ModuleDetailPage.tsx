
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { ArrowLeft, BookOpen, BeakerIcon, GraduationCapIcon, ExternalLink, ChevronRight, Flask } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { getModuleById, getCourseById, getModulesByCourseId } from "@/lib/api";
import { useModuleProgress } from "@/hooks/useModuleProgress";

const ModuleDetailPage = () => {
  const { courseId, moduleId } = useParams<{ courseId: string; moduleId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [nextModuleId, setNextModuleId] = useState<string | null>(null);
  
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
    queryKey: ['course', module?.course_id || courseId],
    queryFn: () => getCourseById(module?.course_id || courseId || ''),
    enabled: !!(module?.course_id || courseId)
  });

  const {
    data: allModules = [],
    isLoading: isLoadingAllModules
  } = useQuery({
    queryKey: ['course-modules', module?.course_id || courseId],
    queryFn: () => getModulesByCourseId(module?.course_id || courseId || ''),
    enabled: !!(module?.course_id || courseId)
  });

  const { 
    currentProgress, 
    isCompleted,
    updateProgress,
    isLoading: isLoadingProgress 
  } = useModuleProgress(moduleId);

  useEffect(() => {
    if (allModules.length > 0 && moduleId) {
      const sortedModules = [...allModules].sort((a, b) => a.order_index - b.order_index);
      
      const currentIndex = sortedModules.findIndex(m => m.id === moduleId);
      
      if (currentIndex >= 0 && currentIndex < sortedModules.length - 1) {
        setNextModuleId(sortedModules[currentIndex + 1].id);
      } else {
        setNextModuleId(null);
      }
    }
  }, [allModules, moduleId]);

  useEffect(() => {
    if (module && currentProgress === 0 && !isCompleted) {
      const initialProgress = 10;
      updateProgress(initialProgress);
    }
  }, [module, currentProgress, isCompleted, updateProgress]);

  const renderModuleIcon = () => {
    switch (module?.type) {
      case 'lab':
        return <BeakerIcon className="h-5 w-5" />;
      case 'quiz':
        return <GraduationCapIcon className="h-5 w-5" />;
      case 'theory':
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const navigateToInteractive = (title: string, contentType: string) => {
    const urlTitle = title.toLowerCase().replace(/\s+/g, '-');
    
    const progressIncrement = 15;
    const newProgress = Math.min(currentProgress + progressIncrement, 100);
    updateProgress(newProgress);
    
    navigate(`/module-interactive/${urlTitle}?type=${contentType}&moduleId=${moduleId}`);
  };

  const handleCompleteModule = async () => {
    await updateProgress(100);
    
    setTimeout(() => {
      if (nextModuleId && course) {
        toast({
          title: "Moving to next module",
          description: "The next module is now available.",
        });
        navigate(`/course/${course.id}/module/${nextModuleId}`);
      } else if (course) {
        toast({
          title: "Course Completed!",
          description: "You've completed all modules in this course.",
        });
        navigate(`/course/${course.id}`);
      }
    }, 1500);
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
                  
                  {section.title.toLowerCase().includes("interactive") ? (
                    <div className="flex flex-col md:flex-row gap-6">
                      {section.image_url && (
                        <div className="md:w-1/3">
                          <div 
                            className="rounded-md overflow-hidden bg-gray-100 aspect-video flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity relative group"
                            onClick={() => navigateToInteractive(section.title, section.title.split(' ')[1].toLowerCase())}
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
                          onClick={() => navigateToInteractive(section.title, section.title.split(' ')[1].toLowerCase())}
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
                                const progressIncrement = 20;
                                const newProgress = Math.min(currentProgress + progressIncrement, 100);
                                updateProgress(newProgress);
                                
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
                              const totalQuestions = quiz.questions.length;
                              const progressPerQuestion = 100 / totalQuestions;
                              
                              const progressForThisQuestion = (index + 1) * progressPerQuestion;
                              const newProgress = Math.min(progressForThisQuestion, 100);
                              
                              updateProgress(newProgress);
                              
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

  // Now we'll properly handle undefined course object
  const actualCourseId = course?.id || module?.course_id || courseId || '';

  if (isLoadingModule || isLoadingCourse || isLoadingProgress || isLoadingAllModules) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12 flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-chemistry-purple"></div>
        </div>
      </Layout>
    );
  }

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
          <Link to={`/course/${actualCourseId}`} className="text-chemistry-purple hover:underline">
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

        <div className="flex justify-between pt-4 mt-8">
          <Button variant="outline" asChild>
            <Link to={`/course/${actualCourseId}`} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Course
            </Link>
          </Button>
          
          {isCompleted ? (
            nextModuleId ? (
              <Button 
                className="bg-chemistry-purple hover:bg-chemistry-blue"
                onClick={() => navigate(`/course/${actualCourseId}/module/${nextModuleId}`)}
              >
                Next Module <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => navigate(`/course/${actualCourseId}`)}
              >
                Course Completed
              </Button>
            )
          ) : (
            <Button 
              className="bg-chemistry-purple hover:bg-chemistry-blue"
              onClick={handleCompleteModule}
            >
              Mark as Complete
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ModuleDetailPage;
