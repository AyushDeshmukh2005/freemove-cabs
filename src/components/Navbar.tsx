
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Moon, Sun, MapPin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
  };

  useEffect(() => {
    // Check if user has dark mode preference
    if (localStorage.theme === 'dark' || 
       (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
    
    // Handle scroll event for navbar appearance
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
            <Link to="/" className={`text-sm font-medium ${location.pathname === '/' ? 'text-gocabs-primary' : 'text-gray-600 dark:text-gray-300 hover:text-gocabs-primary dark:hover:text-gocabs-primary'}`}>
              Home
            </Link>
            <Link to="/#features" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gocabs-primary dark:hover:text-gocabs-primary">
              Features
            </Link>
            <Link to="/#how-it-works" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gocabs-primary dark:hover:text-gocabs-primary">
              How It Works
            </Link>
            <Link to="/#benefits" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gocabs-primary dark:hover:text-gocabs-primary">
              Benefits
            </Link>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              {isDark ? <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" /> : <Moon className="h-5 w-5 text-gray-600" />}
            </button>
            
            {user ? (
              <Link to="/dashboard">
                <Button className="bg-gocabs-primary hover:bg-gocabs-primary/90 text-white">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <div className="flex space-x-3">
                <Link to="/login">
                  <Button variant="outline" className="border-gocabs-primary text-gocabs-primary hover:bg-gocabs-primary/10">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gocabs-primary hover:bg-gocabs-primary/90 text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              {isDark ? <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" /> : <Moon className="h-5 w-5 text-gray-600" />}
            </button>
            <button onClick={toggleMenu} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              {isOpen ? <X className="h-6 w-6 text-gray-600 dark:text-gray-300" /> : <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gocabs-secondary shadow-lg absolute w-full">
          <div className="container-custom py-4 space-y-4">
            <Link to="/" onClick={closeMenu} className={`block py-2 text-sm font-medium ${location.pathname === '/' ? 'text-gocabs-primary' : 'text-gray-600 dark:text-gray-300'}`}>
              Home
            </Link>
            <Link to="/#features" onClick={closeMenu} className="block py-2 text-sm font-medium text-gray-600 dark:text-gray-300">
              Features
            </Link>
            <Link to="/#how-it-works" onClick={closeMenu} className="block py-2 text-sm font-medium text-gray-600 dark:text-gray-300">
              How It Works
            </Link>
            <Link to="/#benefits" onClick={closeMenu} className="block py-2 text-sm font-medium text-gray-600 dark:text-gray-300">
              Benefits
            </Link>
            
            <div className="pt-2 space-y-3">
              {user ? (
                <Link to="/dashboard" onClick={closeMenu}>
                  <Button className="w-full bg-gocabs-primary hover:bg-gocabs-primary/90 text-white">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={closeMenu}>
                    <Button variant="outline" className="w-full border-gocabs-primary text-gocabs-primary hover:bg-gocabs-primary/10">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={closeMenu}>
                    <Button className="w-full bg-gocabs-primary hover:bg-gocabs-primary/90 text-white">
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
