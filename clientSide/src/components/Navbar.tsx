import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, X, BookOpen, PlusCircle } from 'lucide-react';
// @ts-ignore
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ComixLogo from '../assets/comixLogo';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="bg-white shadow-sm py-4 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/generate" className="flex items-center">
            <ComixLogo width={120} height={60} />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/generate" 
              className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-colors ${
                isActive('/generate') 
                  ? 'text-primary-yellow bg-yellow-50' 
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <PlusCircle size={18} />
              Generate
            </Link>
            
            <Link 
              to="/my-works" 
              className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-colors ${
                isActive('/my-works') 
                  ? 'text-primary-yellow bg-yellow-50' 
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <BookOpen size={18} />
              My Works
            </Link>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-md font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <LogOut size={18} />
              Log Out
            </button>
            
            {user && (
              <div className="ml-4 flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary-yellow text-white flex items-center justify-center font-medium">
                  {user.name.charAt(0)}
                </div>
                <span className="ml-2 font-medium text-neutral-800">{user.name}</span>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-neutral-700 hover:text-primary-yellow focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {user && (
                <div className="flex items-center py-3 border-b border-neutral-200">
                  <div className="w-10 h-10 rounded-full bg-primary-yellow text-white flex items-center justify-center font-medium text-lg">
                    {user.name.charAt(0)}
                  </div>
                  <span className="ml-3 font-medium text-neutral-800">{user.name}</span>
                </div>
              )}
              
              <Link 
                to="/generate" 
                className={`flex items-center gap-3 px-4 py-3 rounded-md font-medium w-full ${
                  isActive('/generate') 
                    ? 'text-primary-yellow bg-yellow-50' 
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
                onClick={closeMenu}
              >
                <PlusCircle size={20} />
                Generate
              </Link>
              
              <Link 
                to="/my-works" 
                className={`flex items-center gap-3 px-4 py-3 rounded-md font-medium w-full ${
                  isActive('/my-works') 
                    ? 'text-primary-yellow bg-yellow-50' 
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
                onClick={closeMenu}
              >
                <BookOpen size={20} />
                My Works
              </Link>
              
              <button 
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-md font-medium w-full text-neutral-700 hover:bg-neutral-100"
              >
                <LogOut size={20} />
                Log Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;