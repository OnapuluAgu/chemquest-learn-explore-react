
import { Link } from "react-router-dom";
import { Card, CardContent, CardTitle, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Achievement {
  title: string;
  description: string;
  icon: React.ReactNode;
  achieved: boolean;
  achievedDate?: Date;
}

interface RecentAchievementsProps {
  achievements: Achievement[];
}

export const RecentAchievements = ({ achievements }: RecentAchievementsProps) => {
  const achievedAchievements = achievements.filter(a => a.achieved);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Achievements</CardTitle>
        <CardDescription>Your latest accomplishments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {achievedAchievements.slice(0, 3).map((achievement, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-full text-green-600">
              {achievement.icon}
            </div>
            <div>
              <p className="font-medium text-sm">{achievement.title}</p>
              <p className="text-xs text-gray-500">{achievement.description}</p>
            </div>
          </div>
        ))}
        {achievedAchievements.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <p>No achievements yet. Start learning to earn your first achievement!</p>
          </div>
        )}
        <Button variant="link" asChild className="text-chemistry-purple p-0">
          <Link to="#achievements">View all achievements</Link>
        </Button>
      </CardContent>
    </Card>
  );
};
