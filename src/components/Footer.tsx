
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 mt-12 border-t border-blue-200 dark:border-gray-700">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-1">
            Developed by
          </h3>
          <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
            Shivam Moradia
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            College Librarian
          </p>
          <p className="text-base font-medium text-gray-700 dark:text-gray-300">
            St. Xavier's College (Autonomous) Ahmedabad
          </p>
           <p className="text-base font-medium text-gray-700 dark:text-gray-300">
            moradiashivam@gmail.com
          </p>
        </div>
        
        <div className="mt-8">
          <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-1">
            Under the guidance of
          </h3>
          <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
            Project Mentor
          </p>
          <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
            Dr. Meghna Vyas
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Associate Professor
          </p>
          <p className="text-base font-medium text-gray-700 dark:text-gray-300">
            PG Department of Library and Information Science
          </p>
          <p className="text-base font-medium text-gray-700 dark:text-gray-300">
            Sardar Patel University, Vallabh Vidyanagar
          </p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-blue-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Excel to MARC Converter. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
