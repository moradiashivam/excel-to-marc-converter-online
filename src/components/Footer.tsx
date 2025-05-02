
import React from 'react';
import { Linkedin, Mail, Github } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Footer = () => {
  const isMobile = useIsMobile();
  
  return (
    <footer className="mt-6 sm:mt-8 md:mt-12 py-6 sm:py-8 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30">
      <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Developer Section */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">Developed by</h3>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                <span className="text-base sm:text-lg font-medium text-blue-600 dark:text-blue-300">SM</span>
              </div>
              <div>
                <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">Shivam Moradia</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">College Librarian</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">St. Xavier's College (Autonomous) Ahmedabad</p>
            
            <div className="flex gap-3 sm:gap-4 pt-1 sm:pt-2">
              <a 
                href="https://www.linkedin.com/in/shivam-moradia/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a 
                href="mailto:moradiashivam@gmail.com" 
                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a 
                href="https://github.com/moradiashivam" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                aria-label="GitHub Profile"
              >
                <Github className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
          </div>

          {/* Mentor Section */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">Under the guidance of</h3>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                <span className="text-base sm:text-lg font-medium text-purple-600 dark:text-purple-300">MV</span>
              </div>
              <div>
                <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">Dr. Meghna Vyas</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Associate Professor</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">PG Department of Library and Information Science</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{isMobile ? "Sardar Patel University" : "Sardar Patel University, Vallabh Vidyanagar"}</p>
            
            <div className="pt-1 sm:pt-2">
              <a 
                href="mailto:meghnavyas08@gmail.com" 
                className="inline-flex items-center gap-1 text-xs sm:text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                aria-label="Email Mentor"
              >
                <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                Contact Mentor
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-500">
          © {new Date().getFullYear()} MARC Conversion Tool. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
