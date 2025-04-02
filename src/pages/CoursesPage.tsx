
import { Layout } from "@/components/Layout";
import { FeaturedCourses } from "@/components/FeaturedCourses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AtomIcon, Beaker, BookOpen, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Link } from "react-router-dom";

// Using the same courses data as FeaturedCourses, but we'll add more courses
const coursesData = [
  {
    id: "CQ101",
    title: "CQ101: Foundations of Chemistry",
    description: "Provides a solid understanding of fundamental chemical principles, including atomic structure, bonding, reactions, and stoichiometry.",
    modules: 5,
    level: "Beginner",
    icon: <AtomIcon className="h-5 w-5" />,
    color: "bg-chemistry-soft-purple text-chemistry-purple",
  },
  {
    id: "CQ201",
    title: "CQ201: Organic Chemistry",
    description: "Explore the chemistry of carbon compounds, from basic functional groups to complex reaction mechanisms.",
    modules: 6,
    level: "Intermediate",
    icon: <Beaker className="h-5 w-5" />,
    color: "bg-blue-100 text-chemistry-blue",
  },
  {
    id: "CQ301",
    title: "CQ301: Biochemistry Fundamentals",
    description: "Study the chemical processes and substances that occur within living organisms.",
    modules: 7,
    level: "Advanced",
    icon: <BookOpen className="h-5 w-5" />,
    color: "bg-green-100 text-green-700",
  },
  {
    id: "CQ401",
    title: "CQ401: Physical Chemistry",
    description: "The study of how matter behaves on a molecular and atomic level and how chemical reactions occur.",
    modules: 8,
    level: "Advanced",
    icon: <AtomIcon className="h-5 w-5" />,
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "CQ501",
    title: "CQ501: Analytical Chemistry",
    description: "Learn techniques to analyze substances, determining their composition and structure.",
    modules: 6,
    level: "Intermediate",
    icon: <Beaker className="h-5 w-5" />,
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    id: "CQ601",
    title: "CQ601: Inorganic Chemistry",
    description: "Study non-carbon compounds, including metals, minerals, and organometallic compounds.",
    modules: 7,
    level: "Intermediate",
    icon: <BookOpen className="h-5 w-5" />,
    color: "bg-blue-100 text-blue-700",
  },
];

const CoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  
  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === "" || course.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

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
          
          <div className="flex gap-2">
            <Button 
              variant={filterLevel === "" ? "default" : "outline"} 
              onClick={() => setFilterLevel("")}
              className={filterLevel === "" ? "bg-chemistry-purple hover:bg-chemistry-blue" : ""}
            >
              All Levels
            </Button>
            <Button 
              variant={filterLevel === "Beginner" ? "default" : "outline"} 
              onClick={() => setFilterLevel("Beginner")}
              className={filterLevel === "Beginner" ? "bg-chemistry-purple hover:bg-chemistry-blue" : ""}
            >
              Beginner
            </Button>
            <Button 
              variant={filterLevel === "Intermediate" ? "default" : "outline"} 
              onClick={() => setFilterLevel("Intermediate")}
              className={filterLevel === "Intermediate" ? "bg-chemistry-purple hover:bg-chemistry-blue" : ""}
            >
              Intermediate
            </Button>
            <Button 
              variant={filterLevel === "Advanced" ? "default" : "outline"} 
              onClick={() => setFilterLevel("Advanced")}
              className={filterLevel === "Advanced" ? "bg-chemistry-purple hover:bg-chemistry-blue" : ""}
            >
              Advanced
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2 rounded-md ${course.color}`}>
                    {course.icon}
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
                  <span className="font-medium">{course.modules} Modules</span>
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

        {filteredCourses.length === 0 && (
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
