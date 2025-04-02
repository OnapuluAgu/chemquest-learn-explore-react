
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AtomIcon, BookOpenIcon, FlaskConicalIcon, GraduationCapIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  progress?: number;
  estimatedTime?: string;
  status?: "not-started" | "in-progress" | "completed";
  type?: "theory" | "lab" | "quiz";
}

export const ModuleCard = ({
  id,
  title,
  description,
  progress = 0,
  estimatedTime = "20 min",
  status = "not-started",
  type = "theory",
}: ModuleCardProps) => {
  const getIcon = () => {
    switch (type) {
      case "lab":
        return <FlaskConicalIcon className="h-5 w-5" />;
      case "quiz":
        return <GraduationCapIcon className="h-5 w-5" />;
      case "theory":
      default:
        return <BookOpenIcon className="h-5 w-5" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "not-started":
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "not-started":
      default:
        return "Not Started";
    }
  };

  const getBorderColor = () => {
    if (status === "completed") return "border-green-200";
    if (status === "in-progress") return "border-chemistry-blue";
    return "border-gray-200";
  };

  return (
    <Card className={cn("transition-all hover:shadow-md", getBorderColor())}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                "p-2 rounded-md",
                type === "theory" && "bg-chemistry-soft-purple text-chemistry-purple",
                type === "lab" && "bg-blue-100 text-chemistry-blue",
                type === "quiz" && "bg-amber-100 text-amber-800"
              )}
            >
              {getIcon()}
            </div>
            <Badge variant="outline" className={getStatusColor()}>
              {getStatusText()}
            </Badge>
          </div>
          <Badge variant="outline" className="ml-auto">
            {estimatedTime}
          </Badge>
        </div>
        <h3 className="font-semibold text-lg mt-3">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-chemistry-purple hover:bg-chemistry-blue">
          <Link to={`/module/${id}`}>
            {status === "in-progress" ? "Continue" : status === "completed" ? "Review" : "Start"} Module
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
