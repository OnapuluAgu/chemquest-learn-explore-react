
import { Module } from "@/lib/api/types";
import { ModuleCard } from "@/components/ModuleCard";

interface CourseModulesListProps {
  modules: Module[];
  courseId: string;
  moduleProgress: Record<string, { progress: number, completed: boolean }>;
  isModuleLocked: (index: number) => boolean;
  getModuleStatus: (progress: number | null, completed: boolean | null) => "not-started" | "in-progress" | "completed";
}

export const CourseModulesList = ({ 
  modules, 
  courseId, 
  moduleProgress, 
  isModuleLocked,
  getModuleStatus
}: CourseModulesListProps) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Course Modules</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => {
          const moduleData = moduleProgress[module.id] || { progress: 0, completed: false };
          const locked = isModuleLocked(index);
          // Fixed: Convert the string status to the correct type
          const status = locked 
            ? "not-started" 
            : getModuleStatus(moduleData.progress, moduleData.completed);
          
          return (
            <ModuleCard
              key={module.id}
              id={module.id}
              title={module.title}
              description={module.description}
              progress={moduleData.progress || 0}
              estimatedTime={`${module.estimated_minutes} min`}
              status={status}
              type={module.type}
              locked={locked}
              courseId={courseId}
              orderIndex={module.order_index}
            />
          );
        })}
      </div>
      
      {modules.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No modules available for this course.</p>
        </div>
      )}
    </div>
  );
};
