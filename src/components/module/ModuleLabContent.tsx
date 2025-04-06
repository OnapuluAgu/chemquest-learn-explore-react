
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LabExperiment {
  title: string;
  description: string;
  image_url?: string;
  steps: string[];
}

interface LabContentProps {
  introduction: string;
  experiment: LabExperiment;
  real_life_connection: string;
  handleLabComplete: () => void;
}

export const ModuleLabContent = ({
  introduction,
  experiment,
  real_life_connection,
  handleLabComplete,
}: LabContentProps) => {
  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-3">Introduction</h3>
          <p className="text-gray-700 leading-relaxed">{introduction}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-3">{experiment.title}</h3>
          <p className="text-gray-700 mb-4">{experiment.description}</p>
          
          {experiment.image_url && (
            <div className="rounded-md overflow-hidden bg-gray-100 max-h-80 my-4">
              <img 
                src={experiment.image_url} 
                alt={experiment.title} 
                className="object-contain w-full max-h-80"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
          )}
          
          <div className="mt-6">
            <h4 className="font-medium mb-2">Procedure:</h4>
            <ol className="list-decimal list-inside space-y-2 pl-2">
              {experiment.steps.map((step: string, index: number) => (
                <li key={index} className="text-gray-700">{step}</li>
              ))}
            </ol>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium mb-2">Real-life Connection:</h4>
            <p className="text-gray-700">{real_life_connection}</p>
          </div>
          
          <div className="mt-6">
            <Button
              className="bg-chemistry-purple hover:bg-chemistry-blue"
              onClick={handleLabComplete}
            >
              Complete Lab Activity
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
