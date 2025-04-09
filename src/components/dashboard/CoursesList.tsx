
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface CourseItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  progress: number;
  modules: {
    completed: number;
    total: number;
  };
}

interface CoursesListProps {
  courses: CourseItem[];
}

export const CoursesList = ({ courses }: CoursesListProps) => {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">My Enrolled Courses</h2>
      {courses.map((course) => (
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
    </>
  );
};
