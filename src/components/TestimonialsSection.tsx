
import { Card, CardContent } from "@/components/ui/card";
import { StarIcon } from "lucide-react";

const testimonials = [
  {
    id: 1,
    content: "ChemQuest has completely transformed how I teach chemistry. The interactive modules make abstract concepts tangible for my students.",
    author: "Dr. Sarah Johnson",
    title: "Chemistry Professor, University of Science",
    rating: 5,
  },
  {
    id: 2,
    content: "I struggled with chemistry until I found ChemQuest. The virtual labs helped me understand reactions in a way textbooks never could.",
    author: "Michael Chen",
    title: "Pre-Med Student",
    rating: 5,
  },
  {
    id: 3,
    content: "The gamification elements kept me motivated to continue learning. Earning badges for mastering topics was surprisingly satisfying!",
    author: "Emma Rodriguez",
    title: "High School Student",
    rating: 4,
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from educators and students who have experienced the ChemQuest difference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
