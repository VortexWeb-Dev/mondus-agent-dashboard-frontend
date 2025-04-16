// components/Navbar.jsx
import React from 'react';
import { User } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';

const Navbar = ({ toggleProfile }) => {
  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-600 dark:text-white">
                Dashboard
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            <button
              onClick={toggleProfile}
              className="flex items-center justify-center w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200 cursor-pointer"
              aria-label="Profile"
            >
              <User className="h-5 w-5"/>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;