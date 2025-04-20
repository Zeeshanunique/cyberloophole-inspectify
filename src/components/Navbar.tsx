import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const Navbar = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="bg-white dark:bg-cyberdark shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-cybergray-900 dark:text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-cyberblue-500">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
            CyberLoophole Inspectify
          </Link>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {isMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="8" x2="20" y2="8" />
                    <line x1="4" y1="16" x2="20" y2="16" />
                  </>
                )}
              </svg>
            </Button>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {currentUser ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-cybergray-700 dark:text-cybergray-300 hover:text-cyberblue-500 dark:hover:text-cyberblue-400 ${
                    isActive('/dashboard') ? 'font-medium text-cyberblue-500 dark:text-cyberblue-400' : ''
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/incidents" 
                  className={`text-cybergray-700 dark:text-cybergray-300 hover:text-cyberblue-500 dark:hover:text-cyberblue-400 ${
                    isActive('/incidents') ? 'font-medium text-cyberblue-500 dark:text-cyberblue-400' : ''
                  }`}
                >
                  Incidents
                </Link>
                <Link 
                  to="/analytics" 
                  className={`text-cybergray-700 dark:text-cybergray-300 hover:text-cyberblue-500 dark:hover:text-cyberblue-400 ${
                    isActive('/analytics') ? 'font-medium text-cyberblue-500 dark:text-cyberblue-400' : ''
                  }`}
                >
                  Analytics
                </Link>
                
                {isAdmin && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className={`${
                          isActive('/admin') || isActive('/admin/sources') 
                            ? 'font-medium text-cyberblue-500 dark:text-cyberblue-400' 
                            : 'text-cybergray-700 dark:text-cybergray-300'
                        }`}
                      >
                        Admin
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Admin Tools</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/sources')}>
                        Data Sources
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-cyberblue-100 dark:bg-cyberblue-900 flex items-center justify-center text-cyberblue-600 dark:text-cyberblue-300 font-medium">
                        {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="hidden lg:inline">{currentUser.displayName || currentUser.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-cybergray-700 dark:text-cybergray-300 hover:text-cyberblue-500 dark:hover:text-cyberblue-400"
                >
                  Login
                </Link>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-2">
            <div className="flex flex-col space-y-3">
              {currentUser ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`px-3 py-2 rounded-md ${
                      isActive('/dashboard') 
                        ? 'bg-cyberblue-50 dark:bg-cyberblue-900/20 text-cyberblue-500 dark:text-cyberblue-400 font-medium' 
                        : 'text-cybergray-700 dark:text-cybergray-300'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/incidents" 
                    className={`px-3 py-2 rounded-md ${
                      isActive('/incidents') 
                        ? 'bg-cyberblue-50 dark:bg-cyberblue-900/20 text-cyberblue-500 dark:text-cyberblue-400 font-medium' 
                        : 'text-cybergray-700 dark:text-cybergray-300'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Incidents
                  </Link>
                  <Link 
                    to="/analytics" 
                    className={`px-3 py-2 rounded-md ${
                      isActive('/analytics') 
                        ? 'bg-cyberblue-50 dark:bg-cyberblue-900/20 text-cyberblue-500 dark:text-cyberblue-400 font-medium' 
                        : 'text-cybergray-700 dark:text-cybergray-300'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Analytics
                  </Link>
                  
                  {isAdmin && (
                    <>
                      <div className="px-3 py-2 font-medium text-cybergray-500 dark:text-cybergray-400">
                        Admin
                      </div>
                      <Link 
                        to="/admin" 
                        className={`px-3 py-2 pl-6 rounded-md ${
                          isActive('/admin') 
                            ? 'bg-cyberblue-50 dark:bg-cyberblue-900/20 text-cyberblue-500 dark:text-cyberblue-400 font-medium' 
                            : 'text-cybergray-700 dark:text-cybergray-300'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/admin/sources" 
                        className={`px-3 py-2 pl-6 rounded-md ${
                          isActive('/admin/sources') 
                            ? 'bg-cyberblue-50 dark:bg-cyberblue-900/20 text-cyberblue-500 dark:text-cyberblue-400 font-medium' 
                            : 'text-cybergray-700 dark:text-cybergray-300'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Data Sources
                      </Link>
                    </>
                  )}
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2">
                    <div className="px-3 py-2 font-medium text-cybergray-500 dark:text-cybergray-400">
                      Account
                    </div>
                    <Link 
                      to="/profile" 
                      className="px-3 py-2 pl-6 rounded-md text-cybergray-700 dark:text-cybergray-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/settings" 
                      className="px-3 py-2 pl-6 rounded-md text-cybergray-700 dark:text-cybergray-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 pl-6 rounded-md text-red-600 dark:text-red-400"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="px-3 py-2 rounded-md text-cybergray-700 dark:text-cybergray-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="px-3 py-2 rounded-md bg-cyberblue-500 text-white font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;