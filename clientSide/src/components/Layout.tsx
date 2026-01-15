import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Don't show Navbar on the home, login, or register pages
  const hideNavbar = ["/", "/login", "/register"].includes(location.pathname);
  
  return (
    <div className="min-h-screen flex flex-col">
      {isAuthenticated && !hideNavbar && <Navbar />}
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;