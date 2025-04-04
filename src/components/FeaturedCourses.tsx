
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { AtomIcon, BookOpen, Beaker } from "lucide-react";
import { Badge } from "./ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getCourses } from "@/lib/api";

export const FeaturedCourses = () => {
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['featured-courses'],
    queryFn: getCourses
  });

  // Take only first 3 courses to feature
  const featuredCourses = courses.slice(0, 3);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'atom':
        return <AtomIcon className="h-5 w-5" />;
      case 'beaker':
        return <Beaker className="h-5 w-5" />;
      case 'book':
        return <BookOpen className="h-5 w-5" />;
      default:
        return <AtomIcon className="h-5 w-5" />;
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Courses</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our interactive chemistry courses designed to make learning engaging and effective. 
            Each course combines theory, practical simulations, and assessments.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-chemistry-purple"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-start mb-3">
                    <div className={`p-2 rounded-md ${course.color_class}`}>
                      {getIconComponent(course.icon)}
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {course.level}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-xl">{course.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">{course.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium">{course.total_modules} Modules</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-chemistry-purple hover:bg-chemistry-blue">
                    <Link to={`/course/${course.id}`}>
                      Explore Course
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button asChild variant="outline" className="border-chemistry-purple text-chemistry-purple hover:bg-chemistry-purple hover:text-white">
            <Link to="/courses">View All Courses</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
