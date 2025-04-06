
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const ModuleNotFound = () => {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-4">Module Not Found</h1>
        <p className="mb-6">The module you're looking for doesn't exist or you don't have access to it.</p>
        <Button asChild variant="outline">
          <Link to="/courses">Browse Courses</Link>
        </Button>
      </div>
    </Layout>
  );
};
