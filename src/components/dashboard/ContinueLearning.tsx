
import { ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardDescription, CardHeader } from "@/components/ui/card";

interface CourseItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  nextModule: string;
  modules: {
    completed: number;
    total: number;
  };
  lastAccessed: string;
  nextModuleId: string | null;
}

interface ContinueLearningProps {
  courses: CourseItem[];
  onContinueLearning: (courseId: string, nextModuleId: string | null) => void;
}

export const ContinueLearning = ({ courses, onContinueLearning }: ContinueLearningProps) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Continue Learning</CardTitle>
        <CardDescription>Pick up where you left off</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {courses.map((course) => (
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
              <Button 
                className="bg-chemistry-purple hover:bg-chemistry-blue"
                onClick={() => onContinueLearning(course.id, course.nextModuleId)}
              >
                <span className="flex items-center gap-1">
                  Continue <ChevronsRight className="h-4 w-4" />
                </span>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
