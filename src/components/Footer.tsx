import React from 'react';
import { Linkedin, Mail, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-12 py-8 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Developer Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Developed by</h3>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                <span className="text-lg font-medium text-blue-600 dark:text-blue-300">SM</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Shivam Moradia</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">College Librarian</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">St. Xavier's College (Autonomous) Ahmedabad</p>
            
            <div className="flex gap-4 pt-2">
              <a 
                href="https://www.linkedin.com/in/shivam-moradia/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="mailto:your-email@example.com" 
                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a 
                href="https://github.com/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                aria-label="GitHub Profile"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Mentor Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Under the guidance of</h3>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                <span className="text-lg font-medium text-purple-600 dark:text-purple-300">MV</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Dr. Meghna Vyas</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Associate Professor</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">PG Department of Library and Information Science</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Sardar Patel University, Vallabh Vidyanagar</p>
            
            <div className="pt-2">
              <a 
                href="mailto:mentor-email@example.com" 
                className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                aria-label="Email Mentor"
              >
                <Mail className="h-4 w-4" />
                Contact Mentor
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-500">
          © {new Date().getFullYear()} MARC Conversion Tool. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;