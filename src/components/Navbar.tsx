import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Moon, Sun, MapPin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  useEffect(() => {
    // Handle scroll event for navbar appearance
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 dark:bg-gocabs-secondary/95 shadow-sm backdrop-blur-sm' : 'bg-transparent'}`}>
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="p-2 bg-gocabs-primary rounded-md mr-2">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gocabs-secondary dark:text-white">
              GoCabs
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-gocabs-primary' : 'text-gray-600 dark:text-gray-300 hover:text-gocabs-primary dark:hover:text-gocabs-primary'}`}
            >
              Home
            </Link>
            <a 
              href="/#features" 
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gocabs-primary dark:hover:text-gocabs-primary transition-colors"
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Features
            </a>
            <a 
              href="/#unique-features" 
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gocabs-primary dark:hover:text-gocabs-primary transition-colors"
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  document.getElementById('unique-features')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Unique Features
            </a>
            <a 
              href="/#how-it-works" 
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gocabs-primary dark:hover:text-gocabs-primary transition-colors"
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              How It Works
            </a>
            <a 
              href="/#benefits" 
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gocabs-primary dark:hover:text-gocabs-primary transition-colors"
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Benefits
            </a>
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>
            
            {user ? (
              <Link to="/dashboard">
                <Button className="bg-gocabs-primary hover:bg-gocabs-primary/90 text-white transition-colors">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <div className="flex space-x-3">
                <Link to="/login">
                  <Button variant="outline" className="border-gocabs-primary text-gocabs-primary hover:bg-gocabs-primary/10 transition-colors">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gocabs-primary hover:bg-gocabs-primary/90 text-white transition-colors">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>
            <button 
              onClick={toggleMenu} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? (
                <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gocabs-secondary shadow-lg absolute w-full animate-fade-in">
          <div className="container-custom py-4 space-y-4">
            <Link 
              to="/" 
              onClick={closeMenu}
              className={`block py-2 text-sm font-medium transition-colors ${isActive('/') ? 'text-gocabs-primary' : 'text-gray-600 dark:text-gray-300'}`}
            >
              Home
            </Link>
            <a 
              href="/#features" 
              onClick={(e) => {
                closeMenu();
                if (location.pathname === '/') {
                  e.preventDefault();
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="block py-2 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors"
            >
              Features
            </a>
            <a 
              href="/#unique-features" 
              onClick={(e) => {
                closeMenu();
                if (location.pathname === '/') {
                  e.preventDefault();
                  document.getElementById('unique-features')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="block py-2 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors"
            >
              Unique Features
            </a>
            <a 
              href="/#how-it-works" 
              onClick={(e) => {
                closeMenu();
                if (location.pathname === '/') {
                  e.preventDefault();
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="block py-2 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors"
            >
              How It Works
            </a>
            <a 
              href="/#benefits" 
              onClick={(e) => {
                closeMenu();
                if (location.pathname === '/') {
                  e.preventDefault();
                  document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="block py-2 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors"
            >
              Benefits
            </a>
            
            <div className="pt-2 space-y-3">
              {user ? (
                <Link to="/dashboard" onClick={closeMenu}>
                  <Button className="w-full bg-gocabs-primary hover:bg-gocabs-primary/90 text-white transition-colors">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={closeMenu}>
                    <Button variant="outline" className="w-full border-gocabs-primary text-gocabs-primary hover:bg-gocabs-primary/10 transition-colors">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={closeMenu}>
                    <Button className="w-full bg-gocabs-primary hover:bg-gocabs-primary/90 text-white transition-colors">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
