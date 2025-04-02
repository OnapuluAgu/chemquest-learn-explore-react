
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AtomIcon, Beaker, BookOpen, GraduationCap, LucideIcon, Users } from "lucide-react";

interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  image: string;
}

const TeamMember = ({ name, role, bio, image }: TeamMemberProps) => (
  <div className="flex flex-col items-center p-6 border rounded-lg shadow-sm bg-white transition-transform hover:scale-105">
    <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
      <img src={image} alt={name} className="w-full h-full object-cover" />
    </div>
    <h3 className="text-xl font-semibold mb-1">{name}</h3>
    <p className="text-chemistry-purple font-medium mb-3">{role}</p>
    <p className="text-gray-600 text-center">{bio}</p>
  </div>
);

interface ValueCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const ValueCard = ({ title, description, icon: Icon }: ValueCardProps) => (
  <Card className="h-full">
    <CardContent className="pt-6">
      <div className="flex items-start">
        <div className="p-2 rounded-md bg-chemistry-soft-purple text-chemistry-purple mr-4">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Dr. Emily Chen",
      role: "Founder & Lead Educator",
      bio: "PhD in Chemical Education with 15 years of experience teaching chemistry at university level.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Michael Rodriguez",
      role: "Lead Developer",
      bio: "Full-stack developer specialized in educational technology and interactive simulations.",
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Dr. Sarah Johnson",
      role: "Curriculum Director",
      bio: "Former professor with expertise in developing engaging chemistry curricula for diverse learning styles.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "James Wilson",
      role: "Educational Designer",
      bio: "Specializes in creating interactive learning experiences that make complex concepts accessible.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-3 py-1 text-chemistry-purple border-chemistry-purple">Our Story</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About ChemQuest</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're revolutionizing chemistry education through interactive learning experiences that make complex concepts accessible and engaging.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-20">
          <div className="bg-gradient-to-r from-chemistry-soft-purple to-blue-50 rounded-xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-chemistry-purple">Our Mission</h2>
              <p className="text-lg mb-6">
                ChemQuest was founded in 2023 with a simple yet powerful mission: to transform chemistry education from a passive experience into an interactive journey of discovery.
              </p>
              <p className="text-lg">
                We believe that everyone can understand and appreciate chemistry when concepts are presented in engaging, interactive ways. Our platform combines cutting-edge educational technology with expert-crafted content to create learning experiences that resonate with students of all backgrounds and learning styles.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ValueCard 
              title="Accessible Learning" 
              description="We believe chemistry education should be accessible to everyone, regardless of background or learning style."
              icon={GraduationCap}
            />
            <ValueCard 
              title="Interactive Exploration" 
              description="Our learn-by-doing approach emphasizes experimentation and active engagement with concepts."
              icon={Beaker}
            />
            <ValueCard 
              title="Scientific Accuracy" 
              description="We maintain the highest standards of scientific accuracy while making concepts approachable."
              icon={AtomIcon}
            />
            <ValueCard 
              title="Continuous Innovation" 
              description="We're constantly exploring new ways to make chemistry education more effective and engaging."
              icon={BookOpen}
            />
            <ValueCard 
              title="Supportive Community" 
              description="We foster a community where learners can collaborate, share insights, and support each other."
              icon={Users}
            />
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-2 text-center">Our Team</h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Meet the passionate educators, developers, and designers behind ChemQuest.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <TeamMember key={index} {...member} />
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Have questions, feedback, or suggestions? We'd love to hear from you!
          </p>
          <a 
            href="mailto:contact@chemquest.com" 
            className="inline-block bg-chemistry-purple hover:bg-chemistry-blue text-white font-semibold py-3 px-6 rounded-md transition-colors duration-300"
          >
            Contact Us
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
