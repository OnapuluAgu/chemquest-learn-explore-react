
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const CallToAction = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-chemistry-purple to-chemistry-blue text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Chemistry Learning?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
          Join ChemQuest today and experience the future of interactive chemistry education.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button asChild size="lg" className="bg-white text-chemistry-purple hover:bg-chemistry-soft-purple">
            <Link to="/courses">Explore Courses</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
            <Link to="/signup">Create Account</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
