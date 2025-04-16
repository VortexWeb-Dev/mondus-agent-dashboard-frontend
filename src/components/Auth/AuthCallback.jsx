import React from "react";
import useBitrixAuth from "../../hooks/useBitrixAuth";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    const { isLoading, isAuthenticated, user } = useBitrixAuth();
  
    if (isLoading) return <div className="text-4xl text-center text-gray-600 dark:text-white">Loading...</div>;;
    if (!isAuthenticated) return <p>Redirecting to Bitrix...</p>;
    console.log("user is: ",user);
    // navigate('/ranking')

    return <h1 className="text-3xl text-center text-black dark:text-white">Hi {user.NAME}, You can now navigate using Sidebar! 👋</h1>;
  };
  
export default HomePage;