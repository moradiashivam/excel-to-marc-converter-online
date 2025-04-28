
import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-8 py-6 border-t border-gray-200 dark:border-gray-800 text-center">
      <div className="container mx-auto px-4">
        <div className="space-y-4">
          <div>
            <p className="font-medium">Developed by</p>
            <p>Shivam Moradia</p>
            <p className="text-gray-600 dark:text-gray-400">College Librarian</p>
            <p className="text-gray-600 dark:text-gray-400">St. Xavier's College (Autonomous) Ahmedabad</p>
          </div>
          
          <div className="mt-4">
            <p className="font-medium">Under the guidance of</p>
            <p>Project Mentor</p>
            <p>Dr. Meghna Vyas</p>
            <p className="text-gray-600 dark:text-gray-400">Associate Professor</p>
            <p className="text-gray-600 dark:text-gray-400">PG Department of Library and Information Science</p>
            <p className="text-gray-600 dark:text-gray-400">Sardar Patel University, Vallabh Vidyanagar</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
