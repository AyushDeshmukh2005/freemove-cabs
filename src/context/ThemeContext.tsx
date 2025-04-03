
import React, { createContext, useContext, useState, useEffect } from 'react';
import { themeService } from '@/services/themeService';

type Theme = {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  darkMode: boolean;
  userId: string;
};

type ThemeContextType = {
  themes: Theme[];
  currentTheme: Theme;
  isDarkMode: boolean;
  changeTheme: (themeId: string) => void;
  toggleDarkMode: () => void;
  createCustomTheme: (theme: Omit<Theme, 'id' | 'userId'>) => Promise<boolean>;
  deleteTheme: (themeId: string) => Promise<boolean>;
};

const defaultTheme: Theme = {
  id: 'default',
  name: 'Classic',
  primaryColor: '#0f766e',
  secondaryColor: '#1e293b',
  darkMode: false,
  userId: 'system'
};

const darkTheme: Theme = {
  id: 'dark',
  name: 'Dark Mode',
  primaryColor: '#0f766e',
  secondaryColor: '#020617',
  darkMode: true,
  userId: 'system'
};

const ThemeContext = createContext<ThemeContextType>({
  themes: [defaultTheme, darkTheme],
  currentTheme: defaultTheme,
  isDarkMode: false,
  changeTheme: () => {},
  toggleDarkMode: () => {},
  createCustomTheme: () => Promise.resolve(false),
  deleteTheme: () => Promise.resolve(false)
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themes, setThemes] = useState<Theme[]>([defaultTheme, darkTheme]);
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Load themes from storage or service on mount
  useEffect(() => {
    const storedThemeId = localStorage.getItem('currentThemeId');
    const storedDarkMode = localStorage.getItem('isDarkMode') === 'true';
    
    // Load custom themes from service
    const loadThemes = async () => {
      try {
        const customThemes = await themeService.getUserThemes();
        setThemes([...themes, ...customThemes]);
        
        // Set current theme if stored
        if (storedThemeId) {
          const theme = [...themes, ...customThemes].find(t => t.id === storedThemeId);
          if (theme) {
            setCurrentTheme(theme);
          }
        }
        
        setIsDarkMode(storedDarkMode);
      } catch (error) {
        console.error('Failed to load themes:', error);
      }
    };
    
    loadThemes();
  }, []);

  // Apply theme changes to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    
    // Apply theme colors
    document.documentElement.style.setProperty('--color-primary', currentTheme.primaryColor);
    document.documentElement.style.setProperty('--color-secondary', currentTheme.secondaryColor);
    
    // Save preferences
    localStorage.setItem('currentThemeId', currentTheme.id);
    localStorage.setItem('isDarkMode', isDarkMode.toString());
  }, [currentTheme, isDarkMode]);

  const changeTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      // Optionally update dark mode based on theme
      setIsDarkMode(theme.darkMode);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const createCustomTheme = async (theme: Omit<Theme, 'id' | 'userId'>) => {
    try {
      const newTheme = await themeService.createTheme(theme);
      setThemes(prev => [...prev, newTheme]);
      return true;
    } catch (error) {
      console.error('Failed to create theme:', error);
      return false;
    }
  };

  const deleteTheme = async (themeId: string) => {
    // Cannot delete system themes
    const theme = themes.find(t => t.id === themeId);
    if (!theme || theme.userId === 'system') {
      return false;
    }

    try {
      await themeService.deleteTheme(themeId);
      setThemes(prev => prev.filter(t => t.id !== themeId));
      
      // If current theme is deleted, switch to default
      if (currentTheme.id === themeId) {
        setCurrentTheme(defaultTheme);
      }
      return true;
    } catch (error) {
      console.error('Failed to delete theme:', error);
      return false;
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      themes, 
      currentTheme, 
      isDarkMode,
      changeTheme,
      toggleDarkMode,
      createCustomTheme,
      deleteTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
