import { useState, useEffect } from "react";
import React from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Profile from "./components/Profile";
import "./App.css";
import AgentRankingDashboard from "./Pages/AgentRanking";
import PerformanceReport from "./Pages/PerformanceReports";
import { ThemeProvider } from "./context/ThemeContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  return children;
};

function AppWrapper() {
  return (
    <Router>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Router>
  );
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [bitrixLoaded, setBitrixLoaded] = useState(false);
  const [bitrixLoading, setBitrixLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isInsideBitrix = () => {
    try {
      return window !== window.parent;
    } catch {
      return false;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (location.pathname === "/") {
        navigate("/ranking");
      }
      return;
    }

    const loadBitrix = async () => {
      try {
        setBitrixLoading(true);
        const $logger = window.B24Js.LoggerBrowser.build("local-app", true);
        const $b24 = await window.B24Js.initializeB24Frame();
        $b24.setLogger(window.B24Js.LoggerBrowser.build("Core"));

        $logger.warn("Bitrix24 Frame initialized");

        const response = await $b24.callMethod("user.current");
        const userData = response.getData().result;

        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        navigate("/ranking");
        console.log("Bitrix24 user loaded:", userData);
      } catch (error) {
        console.error("Failed to initialize Bitrix24 SDK:", error);
      } finally {
        setBitrixLoading(false);
      }
    };

    if (isInsideBitrix()) {
      if (!window.B24Js) {
        const script = document.createElement("script");
        script.src =
          "https://unpkg.com/@bitrix24/b24jssdk@latest/dist/umd/index.min.js";
        script.onload = () => {
          setBitrixLoaded(true);
          loadBitrix();
        };
        document.body.appendChild(script);
      } else {
        setBitrixLoaded(true);
        loadBitrix();
      }
    } else {
      console.warn(
        "This application is not running inside a Bitrix24 iframe. Skipping SDK initialization."
      );
    }
  }, [location.pathname, navigate]);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar toggleProfile={toggleProfile} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
          {bitrixLoading ? (
            <div className="flex items-center justify-center h-full">
              <h1 className="text-lg text-gray-600 dark:text-gray-300 animate-pulse">
                Initializing Bitrix24 SDK, please wait...
              </h1>
            </div>
          ) : user ? (
            <Routes>
              <Route
                path="/ranking"
                element={
                  <ProtectedRoute>
                    <AgentRankingDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <PerformanceReport />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/ranking" replace />} />
              <Route path="*" element={<Navigate to="/ranking" replace />} />
            </Routes>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                Unable to authenticate user.
              </h1>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Please make sure this application is launched within Bitrix24.
              </p>
              <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                If the issue persists, contact your system administrator.
              </p>
            </div>
          )}
        </main>
      </div>
      {isProfileOpen && <Profile onClose={toggleProfile} />}
    </div>
  );
}

export default AppWrapper;