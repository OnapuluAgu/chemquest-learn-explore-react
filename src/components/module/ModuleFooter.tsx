
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModuleFooterProps {
  actualCourseId: string;
  isCompleted: boolean;
  nextModuleId: string | null;
  hasAttemptedExercise: boolean;
  handleCompleteModule: () => Promise<void>;
  navigateToNextModule: (nextModuleId: string) => void;
  navigateToCourse: (courseId: string) => void;
}

export const ModuleFooter = ({
  actualCourseId,
  isCompleted,
  nextModuleId,
  hasAttemptedExercise,
  handleCompleteModule,
  navigateToNextModule,
  navigateToCourse,
}: ModuleFooterProps) => {
  return (
    <div className="flex justify-between pt-4 mt-8">
      <Button variant="outline" asChild>
        <Link to={`/course/${actualCourseId}`} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Course
        </Link>
      </Button>
      
      {isCompleted ? (
        nextModuleId ? (
          <Button 
            className="bg-chemistry-purple hover:bg-chemistry-blue"
            onClick={() => navigateToNextModule(nextModuleId)}
          >
            Next Module <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => navigateToCourse(actualCourseId)}
          >
            Course Completed
          </Button>
        )
      ) : (
        <Button 
          className="bg-chemistry-purple hover:bg-chemistry-blue"
          onClick={handleCompleteModule}
          disabled={!hasAttemptedExercise}
        >
          {hasAttemptedExercise ? "Complete & Continue" : "Attempt Exercise to Continue"}
        </Button>
      )}
    </div>
  );
};
