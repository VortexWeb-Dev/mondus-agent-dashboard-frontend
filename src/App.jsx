import { useState } from "react";
import React from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Profile from "./components/Profile";
import "./App.css";
import AgentRankingDashboard from "./Pages/AgentRanking";
import PerformanceReport from "./Pages/PerformanceReports";
import HomePage from "./components/Auth/AuthCallback";
import { ThemeProvider } from "./context/ThemeContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const user = localStorage.getItem("user");
const ProtectedRoute = ({ children }) => {

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <Router>
      <ThemeProvider>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Navbar toggleProfile={toggleProfile} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
              <Routes>
                <Route path="/" element={<HomePage />} />

                <Route
                  path="/ranking"
                  element={
                    <ProtectedRoute>
                      <AgentRankingDashboard  />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <PerformanceReport/>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
          {isProfileOpen && <Profile onClose={toggleProfile} />}
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
