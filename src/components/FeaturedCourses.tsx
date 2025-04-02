
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { AtomIcon, BookOpen, Flask } from "lucide-react";
import { Badge } from "./ui/badge";

const courses = [
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
    icon: <Flask className="h-5 w-5" />,
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
];

export const FeaturedCourses = () => {
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course) => (
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
                <h3 className="font-semibold text-xl">{course.title}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">{course.description}</p>
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

        <div className="text-center mt-12">
          <Button asChild variant="outline" className="border-chemistry-purple text-chemistry-purple hover:bg-chemistry-purple hover:text-white">
            <Link to="/courses">View All Courses</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
