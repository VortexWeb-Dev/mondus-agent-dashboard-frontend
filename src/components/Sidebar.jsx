// components/Sidebar.jsx
import React from "react";
import { BarChart2, TrendingUp, Menu, X } from "lucide-react";

const SidebarItem = ({ icon, text, href, isOpen }) => {
  return (
    <a
      href={href}
      className="flex items-center px-4 py-3  text-gray-700 dark:text-gray-300 hover:bg-blue-100  dark:hover:bg-blue-700 rounded-lg transition-colors duration-200 group"
    >
      <span className="flex items-center justify-center text-blue-600 dark:text-blue-400">
        {icon}
      </span>
      {isOpen && (
        <span className="ml-3 font-medium transition-opacity duration-200">
          {text}
        </span>
      )}
    </a>
  );
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      } flex flex-col`}
    >
      <div className="py-6 px-4 flex items-center justify-between">
        {isOpen ? (
          <>
            <h2 className="text-xl font-semibold tracking-tight text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-xl shadow-sm ring-1 ring-blue-100 dark:ring-blue-800">
               Agent
            </h2>

            <button
              onClick={toggleSidebar}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
              aria-label="Collapse sidebar"
            >
              <X size={20} />
            </button>
          </>
        ) : (
          <button
            onClick={toggleSidebar}
            className="w-full flex justify-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
            aria-label="Expand sidebar"
          >
            <Menu size={24} />
          </button>
        )}
      </div>

      <div className="flex-1 px-2 py-4 space-y-1">
        <SidebarItem
          icon={<BarChart2 size={24} />}
          text="Agent Ranking"
          href="/ranking"
          isOpen={isOpen}
        />
        <SidebarItem
          icon={<TrendingUp size={24} />}
          text="Performance Reports"
          href="/reports"
          isOpen={isOpen}
        />
        {/* Add more sidebar items as needed */}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Dashboard v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
