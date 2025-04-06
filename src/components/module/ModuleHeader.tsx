
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { ModuleType } from "@/types/module";

interface ModuleHeaderProps {
  moduleTitle: string;
  moduleDescription: string;
  moduleType: ModuleType;
  courseTitle: string;
  courseId: string;
  moduleOrderIndex: number;
  estimatedMinutes: number;
  points: number;
  timeRemaining: number | null;
  renderModuleIcon: () => React.ReactNode;
  formatTime: (seconds: number | null) => string;
}

export const ModuleHeader = ({
  moduleTitle,
  moduleDescription,
  moduleType,
  courseTitle,
  courseId,
  moduleOrderIndex,
  estimatedMinutes,
  points,
  timeRemaining,
  renderModuleIcon,
  formatTime,
}: ModuleHeaderProps) => {
  return (
    <>
      <div className="flex items-center mb-6">
        <Link to={`/course/${courseId}`} className="text-chemistry-purple hover:underline">
          {courseTitle || 'Course'}
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium">Module {moduleOrderIndex}</span>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{moduleTitle}</h1>
          <p className="text-gray-600 mt-2">{moduleDescription}</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
            <Clock className="h-4 w-4 text-chemistry-purple" />
            <span>{formatTime(timeRemaining)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className={`p-2 rounded-md ${
              moduleType === 'theory' ? "bg-chemistry-soft-purple text-chemistry-purple" :
              moduleType === 'lab' ? "bg-blue-100 text-chemistry-blue" :
              "bg-amber-100 text-amber-800"
            }`}>
              {renderModuleIcon()}
            </div>
            <span className="capitalize">{moduleType}</span>
            <span className="mx-2">•</span>
            <span>{estimatedMinutes} min</span>
            <span className="mx-2">•</span>
            <span>{points} pts</span>
          </div>
        </div>
      </div>
    </>
  );
};
