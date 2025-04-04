
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AtomIcon, Beaker, BookOpen, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCourses } from "@/lib/api";

const CoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses
  });
  
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

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === "" || course.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  // Extract unique levels for the filter buttons
  const uniqueLevels = Array.from(new Set(courses.map(course => course.level)));

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Chemistry Courses</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our comprehensive collection of interactive chemistry courses designed to make learning engaging and effective.
          </p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search courses..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={filterLevel === "" ? "default" : "outline"} 
              onClick={() => setFilterLevel("")}
              className={filterLevel === "" ? "bg-chemistry-purple hover:bg-chemistry-blue" : ""}
            >
              All Levels
            </Button>
            
            {uniqueLevels.map(level => (
              <Button 
                key={level}
                variant={filterLevel === level ? "default" : "outline"} 
                onClick={() => setFilterLevel(level)}
                className={filterLevel === level ? "bg-chemistry-purple hover:bg-chemistry-blue" : ""}
              >
                {level}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-chemistry-purple"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
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
                  <CardTitle>{course.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-3">{course.description}</CardDescription>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium">{course.total_modules} Modules</span>
                    <span className="mx-2">•</span>
                    <span>{course.estimated_hours} Hours</span>
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

        {!isLoading && filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CoursesPage;
