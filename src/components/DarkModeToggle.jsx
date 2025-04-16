import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../context/ThemeContext';

const DarkModeToggle = () => {
  const { darkMode, setDarkMode } = useDarkMode();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className={`relative w-18 h-10 rounded-full p-0.5 transition-all duration-500 ease-in-out ${
        darkMode ? 'bg-indigo-900' : 'bg-blue-400'
      } cursor-pointer`}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Toggle Circle */}
      <div
        className={`absolute top-0.5 w-9 h-9 rounded-full flex items-center justify-center shadow-md transform transition-all duration-500 ${
          darkMode
            ? 'bg-indigo-700 translate-x-8 shadow-indigo-700/30'
            : 'bg-yellow-300 translate-x-0 shadow-yellow-500/30'
        }`}
      >
        {darkMode ? (
          <Moon size={14} className="text-white" />
        ) : (
          <Sun size={14} className="text-yellow-600" />
        )}
      </div>

      {/* Optional glow in dark mode */}
      {darkMode && (
        <div className="absolute inset-0 rounded-full bg-indigo-500 opacity-20 blur-sm pointer-events-none"></div>
      )}
    </button>
  );
};

export default DarkModeToggle;
