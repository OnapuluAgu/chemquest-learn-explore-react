
import { Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Achievement {
  title: string;
  description: string;
  icon: React.ReactNode;
  achieved: boolean;
  achievedDate?: Date;
}

interface AchievementsListProps {
  achievements: Achievement[];
}

export const AchievementsList = ({ achievements }: AchievementsListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {achievements.map((achievement, index) => (
        <Card key={index} className={achievement.achieved ? "" : "opacity-60"}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${achievement.achieved ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                {achievement.icon}
              </div>
              <div>
                <h3 className="font-semibold">{achievement.title}</h3>
                <p className="text-sm text-gray-500">{achievement.description}</p>
                <div className="mt-2">
                  {achievement.achieved ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Award className="h-3 w-3 mr-1" /> Achieved
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      In Progress
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
