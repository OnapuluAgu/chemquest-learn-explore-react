
import { Link } from "react-router-dom";
import { ArrowLeft, AtomIcon, BeakerIcon, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Course } from "@/lib/api/types";

interface CourseHeaderProps {
  course: Course;
  calculateCourseProgress: () => number;
}

export const CourseHeader = ({ course, calculateCourseProgress }: CourseHeaderProps) => {
  // Get course icon component
  const renderCourseIcon = () => {
    switch (course.icon) {
      case 'atom':
        return <AtomIcon className="h-7 w-7" />;
      case 'beaker':
        return <BeakerIcon className="h-7 w-7" />;
      case 'book':
        return <BookOpen className="h-7 w-7" />;
      default:
        return <AtomIcon className="h-7 w-7" />;
    }
  };

  return (
    <>
      <Button asChild variant="outline" className="mb-6" size="sm">
        <Link to="/courses" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Courses
        </Link>
      </Button>

      <div className="flex flex-col md:flex-row gap-6 mb-10">
        <div className="md:w-2/3">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-md ${course.color_class}`}>
              {renderCourseIcon()}
            </div>
            <div className="inline-flex px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
              {course.level}
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
          <p className="text-gray-600 mb-6">{course.description}</p>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span className="font-medium">{course.total_modules}</span> Modules
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">{course.estimated_hours}</span> Hours
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">{calculateCourseProgress()}%</span> Complete
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
