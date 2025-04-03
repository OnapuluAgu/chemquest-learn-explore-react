
import { Layout } from "@/components/Layout";
import { HeroSection } from "@/components/HeroSection";
import { FeaturedCourses } from "@/components/FeaturedCourses";
import { ModuleShowcase } from "@/components/ModuleShowcase";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CallToAction } from "@/components/CallToAction";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    console.log("Index page rendered");
  }, []);

  return (
    <Layout>
      <HeroSection />
      <FeaturedCourses />
      <ModuleShowcase />
      <FeaturesSection />
      <TestimonialsSection />
      <CallToAction />
    </Layout>
  );
};

export default Index;
