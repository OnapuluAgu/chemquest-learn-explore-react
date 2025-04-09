
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserCourses, getUserAchievements, getUserActivities, getModulesByCourseId } from "@/lib/api";
import { format, parseISO } from "date-fns";
import { AtomIcon, Beaker, Clock, Trophy, Calendar, BookOpen } from "lucide-react";

export function useDashboardData() {
  const [nextModulesMap, setNextModulesMap] = useState<Record<string, string>>({});
  
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

  useEffect(() => {
    const fetchNextModules = async () => {
      const moduleMap: Record<string, string> = {};
      
      for (const course of courses) {
        try {
          const modules = await getModulesByCourseId(course.id);
          
          const sortedModules = [...modules].sort((a, b) => a.order_index - b.order_index);
          
          const nextIndex = course.modules_completed >= sortedModules.length 
            ? 0
            : course.modules_completed;
            
          if (sortedModules[nextIndex]) {
            moduleMap[course.id] = sortedModules[nextIndex].id;
          }
        } catch (error) {
          console.error(`Error fetching modules for course ${course.id}:`, error);
        }
      }
      
      setNextModulesMap(moduleMap);
    };
    
    if (courses.length > 0) {
      fetchNextModules();
    }
  }, [courses]);

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
    nextModuleId: nextModulesMap[course.id] || null
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

  const isLoading = isLoadingCourses || isLoadingAchievements || isLoadingActivities;

  // If no data is available, provide default values for display
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
      nextModuleId: null
    }
  ];

  const achievementsToDisplay = mappedAchievements.length > 0 ? mappedAchievements : [
    { title: "Quick Learner", description: "Complete 5 modules in under a week", icon: <Clock className="h-4 w-4" />, achieved: false },
    { title: "Chemistry Novice", description: "Earn 75% or higher on 3 quizzes", icon: <Trophy className="h-4 w-4" />, achieved: false }
  ];

  const activitiesToDisplay = mappedActivities.length > 0 ? mappedActivities : [
    { description: "Start your chemistry journey by enrolling in a course", time: "Now" },
  ];

  return {
    courses: coursesToDisplay,
    achievements: achievementsToDisplay,
    activities: activitiesToDisplay,
    isLoading,
    nextModulesMap
  };
}
