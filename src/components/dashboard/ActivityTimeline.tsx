
import { Card, CardContent, CardTitle, CardDescription, CardHeader } from "@/components/ui/card";

interface Activity {
  description: string;
  time: string;
}

interface ActivityTimelineProps {
  activities: Activity[];
}

export const ActivityTimeline = ({ activities }: ActivityTimelineProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your recent learning activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
              <div className="relative flex h-6 w-6 flex-none items-center justify-center">
                <div className="bg-chemistry-soft-purple h-2 w-2 rounded-full" />
                {index !== activities.length -.5 && (
                  <div className="absolute top-6 bottom-0 left-1/2 h-full w-px -translate-x-1/2 bg-gray-200" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm">{activity.description}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
