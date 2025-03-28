
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Car, Menu, X, Sun, Moon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Check user preference for dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast({
      title: newMode ? 'Dark mode enabled' : 'Light mode enabled',
      duration: 1500,
    });
  };

  const navItems = [
    { name: 'Home', href: '#' },
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Benefits', href: '#benefits' },
    { name: 'Download', href: '#download' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white dark:bg-gocabs-dark shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="container-custom">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-gocabs-primary" />
            <span className="text-xl font-bold text-gocabs-secondary dark:text-white">
              Go<span className="text-gocabs-primary">Cabs</span>
            </span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {navItems.map((item) => (
                <a 
                  key={item.name} 
                  href={item.href}
                  className="text-gocabs-secondary dark:text-white hover:text-gocabs-primary dark:hover:text-gocabs-primary transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleDarkMode}
                className="rounded-full p-2 h-9 w-9"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
              <Button 
                variant="default" 
                className="bg-gocabs-primary hover:bg-gocabs-primary/90"
              >
                Get Started
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleDarkMode}
              className="rounded-full p-2 h-9 w-9"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 invisible'} overflow-hidden bg-white dark:bg-gocabs-dark shadow-lg`}>
        <div className="container-custom py-4 space-y-4">
          {navItems.map((item) => (
            <a 
              key={item.name} 
              href={item.href}
              className="block py-2 text-gocabs-secondary dark:text-white hover:text-gocabs-primary dark:hover:text-gocabs-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <Button 
            variant="default" 
            className="w-full bg-gocabs-primary hover:bg-gocabs-primary/90 mt-4"
          >
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
