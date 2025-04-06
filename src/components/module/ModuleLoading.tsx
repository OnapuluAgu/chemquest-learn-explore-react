
import { Layout } from "@/components/Layout";

export const ModuleLoading = () => {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-chemistry-purple"></div>
      </div>
    </Layout>
  );
};
