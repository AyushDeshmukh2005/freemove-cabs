
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  
  return (
    <nav className="py-4 px-6 flex justify-between items-center bg-background border-b">
      <div onClick={() => navigate('/')} className="text-2xl font-bold cursor-pointer text-primary">
        GoCabs
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label="Toggle theme">
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        
        <Button variant="outline" onClick={() => navigate('/login')}>
          Sign In
        </Button>
        
        <Button onClick={() => navigate('/signup')}>
          Sign Up
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
