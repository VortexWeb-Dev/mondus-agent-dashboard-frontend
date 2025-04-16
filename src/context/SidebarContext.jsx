import React, { createContext, useState } from 'react';

// Create the context
export const SidebarContext = createContext();

// Create a provider component
export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(prevState => !prevState);
  };

  // The value that will be provided to consumers of this context
  const value = {
    isCollapsed,
    setIsCollapsed,
    toggleSidebar
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};