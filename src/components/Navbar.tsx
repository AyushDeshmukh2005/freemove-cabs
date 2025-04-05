
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Menu, X, User, Sun, Moon, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2.5 fixed w-full top-0 left-0 z-50">
      <div className="flex flex-wrap justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="self-center text-xl font-semibold whitespace-nowrap text-gocabs-primary">
            GoCabs
          </span>
        </Link>
        
        <div className="flex items-center md:order-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="hidden md:flex"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          {user ? (
            <div className="flex items-center">
              <Button
                variant="ghost"
                className="flex items-center gap-2 mr-2"
                asChild
              >
                <Link to="/dashboard">
                  <User className="h-5 w-5" />
                  <span className="hidden md:block">Dashboard</span>
                </Link>
              </Button>
              <Button
                variant="default"
                onClick={logout}
                className="hidden md:block"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild className="hidden md:flex">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button variant="default" asChild className="hidden md:flex">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="md:hidden"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        
        <div className={`md:flex md:w-auto md:order-1 ${isMenuOpen ? 'block w-full' : 'hidden'}`}>
          <ul className="flex flex-col p-4 mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
            <li>
              <Link
                to="/"
                className="block py-2 pr-4 pl-3 text-gray-700 hover:text-gocabs-primary md:p-0 dark:text-gray-400 dark:hover:text-white"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/features"
                className="block py-2 pr-4 pl-3 text-gray-700 hover:text-gocabs-primary md:p-0 dark:text-gray-400 dark:hover:text-white"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                to="/pricing"
                className="block py-2 pr-4 pl-3 text-gray-700 hover:text-gocabs-primary md:p-0 dark:text-gray-400 dark:hover:text-white"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="block py-2 pr-4 pl-3 text-gray-700 hover:text-gocabs-primary md:p-0 dark:text-gray-400 dark:hover:text-white"
              >
                Contact
              </Link>
            </li>
            {isMenuOpen && (
              <>
                <li className="md:hidden">
                  <Button
                    variant="ghost"
                    onClick={toggleDarkMode}
                    className="flex w-full justify-start py-2 pr-4 pl-3"
                  >
                    {theme === 'dark' ? (
                      <>
                        <Sun className="h-5 w-5 mr-2" /> Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="h-5 w-5 mr-2" /> Dark Mode
                      </>
                    )}
                  </Button>
                </li>
                {!user ? (
                  <>
                    <li className="md:hidden">
                      <Link
                        to="/login"
                        className="block py-2 pr-4 pl-3 text-gray-700 hover:text-gocabs-primary md:p-0 dark:text-gray-400 dark:hover:text-white"
                      >
                        Sign In
                      </Link>
                    </li>
                    <li className="md:hidden">
                      <Link
                        to="/signup"
                        className="block py-2 pr-4 pl-3 text-gray-700 hover:text-gocabs-primary md:p-0 dark:text-gray-400 dark:hover:text-white"
                      >
                        Sign Up
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="md:hidden">
                      <Link
                        to="/dashboard"
                        className="block py-2 pr-4 pl-3 text-gray-700 hover:text-gocabs-primary md:p-0 dark:text-gray-400 dark:hover:text-white"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li className="md:hidden">
                      <button
                        onClick={logout}
                        className="block w-full text-left py-2 pr-4 pl-3 text-gray-700 hover:text-gocabs-primary md:p-0 dark:text-gray-400 dark:hover:text-white"
                      >
                        Sign Out
                      </button>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
