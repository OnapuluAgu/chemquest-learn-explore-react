
import { Progress } from "@/components/ui/progress";

interface ModuleProgressProps {
  currentProgress: number;
}

export const ModuleProgress = ({ currentProgress }: ModuleProgressProps) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium">Your Progress</span>
        <span>{currentProgress}%</span>
      </div>
      <Progress value={currentProgress} className="h-2" />
    </div>
  );
};
