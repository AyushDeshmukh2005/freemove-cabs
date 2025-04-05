
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleTheme = () => {
    setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary">GoCabs</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <Link to="/" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary">
              Home
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary">
                  Dashboard
                </Link>
                <Link to="/ride-history" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary">
                  Ride History
                </Link>
                <Button variant="ghost" onClick={logout}>Logout</Button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary">
                  Login
                </Link>
                <Link to="/signup" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary">
                  Sign Up
                </Link>
              </>
            )}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-6">
                  <Link to="/" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary">
                    Home
                  </Link>
                  {user ? (
                    <>
                      <Link to="/dashboard" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary">
                        Dashboard
                      </Link>
                      <Link to="/ride-history" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary">
                        Ride History
                      </Link>
                      <Button variant="ghost" onClick={logout}>Logout</Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary">
                        Login
                      </Link>
                      <Link to="/signup" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary">
                        Sign Up
                      </Link>
                    </>
                  )}
                  <Button variant="ghost" size="icon" onClick={toggleTheme}>
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
