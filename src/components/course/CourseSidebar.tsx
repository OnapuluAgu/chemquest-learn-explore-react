
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Course, Module } from "@/lib/api/types";

interface CourseSidebarProps {
  course: Course;
  calculateCourseProgress: () => number;
  getFirstAvailableModule: () => string | undefined;
  courseId: string;
}

export const CourseSidebar = ({ 
  course, 
  calculateCourseProgress, 
  getFirstAvailableModule,
  courseId 
}: CourseSidebarProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="md:w-1/3">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold mb-4">Course Details</h3>
        <ul className="space-y-3">
          <li className="flex justify-between">
            <span className="text-gray-600">Level:</span>
            <span className="font-medium">{course.level}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600">Modules:</span>
            <span className="font-medium">{course.total_modules}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">{course.estimated_hours} hours</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600">Progress:</span>
            <span className="font-medium">{calculateCourseProgress()}%</span>
          </li>
        </ul>
        
        <Separator className="my-4" />
        
        <Button 
          asChild 
          className="w-full bg-chemistry-purple hover:bg-chemistry-blue"
          onClick={() => {
            const moduleId = getFirstAvailableModule();
            if (moduleId) {
              navigate(`/course/${courseId}/module/${moduleId}`);
            }
          }}
        >
          <Link to={`/course/${courseId}/module/${getFirstAvailableModule()}`}>
            Continue Learning
          </Link>
        </Button>
      </div>
    </div>
  );
};
