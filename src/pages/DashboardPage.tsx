
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AtomIcon, Beaker, ChevronsRight, Award, Trophy, Calendar, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getUserCourses, getUserAchievements, getUserActivities } from "@/lib/api";
import { format, parseISO } from "date-fns";

const DashboardPage = () => {
  const { 
    data: courses = [], 
    isLoading: isLoadingCourses 
  } = useQuery({
    queryKey: ['userCourses'],
    queryFn: getUserCourses
  });

  const { 
    data: achievements = [], 
    isLoading: isLoadingAchievements 
  } = useQuery({
    queryKey: ['userAchievements'],
    queryFn: getUserAchievements
  });

  const { 
    data: activities = [], 
    isLoading: isLoadingActivities 
  } = useQuery({
    queryKey: ['userActivities'],
    queryFn: getUserActivities
  });

  // Map the data to match the UI components
  const mappedCourses = courses.map(course => ({
    id: course.id,
    title: course.title,
    progress: course.progress,
    lastAccessed: course.last_accessed ? format(parseISO(course.last_accessed), "MMM d, yyyy") : "Never",
    modules: {
      completed: course.modules_completed,
      total: course.modules_total
    },
    nextModule: course.next_module,
    icon: getIconFromName(course.course_icon),
    color: course.color_class,
  }));

  const mappedAchievements = achievements.map(achievement => ({
    title: achievement.title,
    description: achievement.description,
    icon: getIconFromName(achievement.icon),
    achieved: achievement.achieved,
    achievedDate: achievement.achieved_date ? parseISO(achievement.achieved_date) : undefined
  }));

  const mappedActivities = activities.map(activity => ({
    description: activity.description,
    time: activity.created_at ? formatActivityTime(parseISO(activity.created_at)) : ""
  }));

  function getIconFromName(iconName: string) {
    switch (iconName) {
      case 'atom':
        return <AtomIcon className="h-5 w-5" />;
      case 'beaker':
        return <Beaker className="h-5 w-5" />;
      case 'clock':
        return <Clock className="h-5 w-5" />;
      case 'trophy':
        return <Trophy className="h-5 w-5" />;
      case 'calendar':
        return <Calendar className="h-5 w-5" />;
      case 'book':
        return <BookOpen className="h-5 w-5" />;
      default:
        return <AtomIcon className="h-5 w-5" />;
    }
  }

  function formatActivityTime(date: Date) {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return `Today, ${format(date, "h:mm a")}`;
    } else if (diffInDays === 1) {
      return `Yesterday, ${format(date, "h:mm a")}`;
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago, ${format(date, "h:mm a")}`;
    } else {
      return format(date, "MMM d, yyyy, h:mm a");
    }
  }

  // Show loading state if data is loading
  const isLoading = isLoadingCourses || isLoadingAchievements || isLoadingActivities;
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12 flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-chemistry-purple"></div>
        </div>
      </Layout>
    );
  }

  // Use fallback data if no courses or achievements are available
  const coursesToDisplay = mappedCourses.length > 0 ? mappedCourses : [
    {
      id: "CQ101",
      title: "CQ101: Foundations of Chemistry",
      progress: 0,
      lastAccessed: "Never",
      modules: {
        completed: 0,
        total: 5
      },
      nextModule: "Introduction to Chemistry",
      icon: <AtomIcon className="h-5 w-5" />,
      color: "bg-chemistry-soft-purple text-chemistry-purple",
    }
  ];

  const achievementsToDisplay = mappedAchievements.length > 0 ? mappedAchievements : [
    { title: "Quick Learner", description: "Complete 5 modules in under a week", icon: <Clock className="h-4 w-4" />, achieved: false },
    { title: "Chemistry Novice", description: "Earn 75% or higher on 3 quizzes", icon: <Trophy className="h-4 w-4" />, achieved: false }
  ];

  const activitiesToDisplay = mappedActivities.length > 0 ? mappedActivities : [
    { description: "Start your chemistry journey by enrolling in a course", time: "Now" },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>
        
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Progress Summary</CardTitle>
                  <CardDescription>Your overall learning progress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {coursesToDisplay.map((course) => (
                    <div key={course.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{course.title}</span>
                        <span className="text-sm text-gray-500">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Achievements</CardTitle>
                  <CardDescription>Your latest accomplishments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {achievementsToDisplay.filter(a => a.achieved).slice(0, 3).map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-full text-green-600">
                        {achievement.icon}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{achievement.title}</p>
                        <p className="text-xs text-gray-500">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                  {achievementsToDisplay.filter(a => a.achieved).length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <p>No achievements yet. Start learning to earn your first achievement!</p>
                    </div>
                  )}
                  <Button variant="link" asChild className="text-chemistry-purple p-0">
                    <Link to="#achievements">View all achievements</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Continue Learning</CardTitle>
                  <CardDescription>Pick up where you left off</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {coursesToDisplay.map((course) => (
                    <div key={course.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-md ${course.color}`}>
                          {course.icon}
                        </div>
                        <div>
                          <h3 className="font-medium">{course.title}</h3>
                          <p className="text-sm text-gray-500">
                            Next: Module {course.modules.completed + 1} - {course.nextModule}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                        <div className="text-sm text-gray-500">
                          Last accessed: {course.lastAccessed}
                        </div>
                        <Button asChild className="bg-chemistry-purple hover:bg-chemistry-blue">
                          <Link to={`/course/${course.id}/module/${course.modules.completed + 1}`}>
                            <span className="flex items-center gap-1">
                              Continue <ChevronsRight className="h-4 w-4" />
                            </span>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="courses" className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">My Enrolled Courses</h2>
            {coursesToDisplay.map((course) => (
              <Card key={course.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-md ${course.color}`}>
                        {course.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{course.title}</h3>
                        <p className="text-sm text-gray-500">
                          {course.modules.completed} of {course.modules.total} modules completed
                        </p>
                        <div className="w-full md:w-40 mt-2">
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                    <Button asChild className="bg-chemistry-purple hover:bg-chemistry-blue">
                      <Link to={`/course/${course.id}`}>Go to Course</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <div className="text-center mt-6">
              <Button asChild variant="outline" className="border-chemistry-purple text-chemistry-purple hover:bg-chemistry-purple hover:text-white">
                <Link to="/courses">Browse More Courses</Link>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="achievements" id="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievementsToDisplay.map((achievement, index) => (
                <Card key={index} className={achievement.achieved ? "" : "opacity-60"}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${achievement.achieved ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                        {achievement.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-sm text-gray-500">{achievement.description}</p>
                        <div className="mt-2">
                          {achievement.achieved ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Award className="h-3 w-3 mr-1" /> Achieved
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              In Progress
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent learning activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {activitiesToDisplay.map((activity, index) => (
                    <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                      <div className="relative flex h-6 w-6 flex-none items-center justify-center">
                        <div className="bg-chemistry-soft-purple h-2 w-2 rounded-full" />
                        {index !== activitiesToDisplay.length - 1 && (
                          <div className="absolute top-6 bottom-0 left-1/2 h-full w-px -translate-x-1/2 bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DashboardPage;
