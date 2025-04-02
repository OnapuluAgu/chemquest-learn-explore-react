
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, BookOpen, BrainCircuit, Medal, Trophy, Users } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-1 border-chemistry-purple text-chemistry-purple">
            INNOVATION FOR 2025
          </Badge>
          <h2 className="text-3xl font-bold mb-4">Why Choose ChemQuest</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform is designed with the latest educational technology to transform how
            chemistry is taught and learned.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="rounded-full bg-chemistry-soft-purple p-3 w-12 h-12 flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-chemistry-purple" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Interactive Learning</h3>
            <p className="text-gray-600">
              Transform abstract concepts into tangible experiences with our interactive modules.
              Learn by doing, not just reading.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
              <Trophy className="h-6 w-6 text-chemistry-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Gamified Progress</h3>
            <p className="text-gray-600">
              Earn points, badges, and track your progress. Gamification elements make learning
              more engaging and motivating.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="rounded-full bg-green-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
              <BadgeCheck className="h-6 w-6 text-green-700" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Personalized Feedback</h3>
            <p className="text-gray-600">
              Receive tailored feedback on quizzes and simulations. Identify and address
              misconceptions immediately.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="rounded-full bg-amber-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-amber-700" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Community Learning</h3>
            <p className="text-gray-600">
              Join a community of learners. Discuss concepts, ask questions, and collaborate
              on problem-solving.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="rounded-full bg-purple-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
              <Medal className="h-6 w-6 text-purple-700" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Achievement System</h3>
            <p className="text-gray-600">
              Unlock achievements as you master topics. Showcase your chemistry expertise
              with earned badges and certificates.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="rounded-full bg-indigo-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
              <BrainCircuit className="h-6 w-6 text-indigo-700" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Enhanced Learning</h3>
            <p className="text-gray-600">
              Future integration with AI tutors will provide personalized hints, explanations,
              and learning pathways tailored to your needs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
