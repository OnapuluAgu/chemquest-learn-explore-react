
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardTitle, CardDescription, CardHeader } from "@/components/ui/card";

interface CourseProgress {
  id: string;
  title: string;
  progress: number;
}

interface ProgressSummaryProps {
  courses: CourseProgress[];
}

export const ProgressSummary = ({ courses }: ProgressSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Summary</CardTitle>
        <CardDescription>Your overall learning progress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {courses.map((course) => (
          <div key={course.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm">{course.title}</span>
              <span className="text-sm text-gray-500">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
