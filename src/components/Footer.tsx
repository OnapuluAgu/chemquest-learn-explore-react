
import { Link } from "react-router-dom";
import { AtomIcon, Github, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 pt-12 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative w-6 h-6">
                <AtomIcon className="w-6 h-6 text-chemistry-purple" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-chemistry-purple to-chemistry-blue bg-clip-text text-transparent">
                ChemQuest
              </span>
            </Link>
            <p className="mt-3 text-sm text-gray-600">
              Making chemistry education interactive, engaging, and effective.
            </p>
            <div className="flex mt-4 space-x-3">
              <a href="#" className="text-gray-500 hover:text-chemistry-purple transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-chemistry-purple transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Platform</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/courses" className="text-sm text-gray-600 hover:text-chemistry-purple">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-gray-600 hover:text-chemistry-purple">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/virtual-lab" className="text-sm text-gray-600 hover:text-chemistry-purple">
                  Virtual Lab
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/faqs" className="text-sm text-gray-600 hover:text-chemistry-purple">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-gray-600 hover:text-chemistry-purple">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-sm text-gray-600 hover:text-chemistry-purple">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-chemistry-purple">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-chemistry-purple">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} ChemQuest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
