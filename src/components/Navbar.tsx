
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AtomIcon, BookOpenIcon, Home, LayoutDashboard, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const NavLinks = [
  { name: "Home", href: "/", icon: <Home className="h-4 w-4 mr-2" /> },
  { name: "Courses", href: "/courses", icon: <BookOpenIcon className="h-4 w-4 mr-2" /> },
  { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
];

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative w-8 h-8">
                <AtomIcon className="w-8 h-8 text-chemistry-purple" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-chemistry-purple to-chemistry-blue bg-clip-text text-transparent">
                ChemQuest
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {NavLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href}
                className="flex items-center text-gray-600 hover:text-chemistry-purple transition-colors"
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {user.email}
                </span>
                <Button 
                  variant="outline" 
                  className="border-chemistry-purple text-chemistry-purple hover:bg-chemistry-purple hover:text-white"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="border-chemistry-purple text-chemistry-purple hover:bg-chemistry-purple hover:text-white"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-chemistry-purple hover:bg-chemistry-blue text-white"
                  onClick={() => navigate('/auth?tab=signup')}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "md:hidden absolute left-0 right-0 bg-white z-50 border-b border-gray-100 shadow-lg transition-all duration-300 ease-in-out",
          mobileMenuOpen ? "top-16 opacity-100" : "-top-96 opacity-0"
        )}>
          <div className="px-4 py-5 space-y-5">
            {NavLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="flex items-center text-gray-600 hover:text-chemistry-purple transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 pt-2">
              {user ? (
                <>
                  <div className="text-sm text-gray-600 py-2">
                    {user.email}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full border-chemistry-purple text-chemistry-purple hover:bg-chemistry-purple hover:text-white"
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full border-chemistry-purple text-chemistry-purple hover:bg-chemistry-purple hover:text-white"
                    onClick={() => {
                      navigate('/auth');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="w-full bg-chemistry-purple hover:bg-chemistry-blue text-white"
                    onClick={() => {
                      navigate('/auth?tab=signup');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
