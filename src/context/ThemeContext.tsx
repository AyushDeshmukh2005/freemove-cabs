
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { themeService } from '../services/themeService';

export interface Theme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor?: string;
  textColor?: string;
  backgroundColor?: string;
  isDark?: boolean;
  userId?: string;
}

interface ThemeContextType {
  isDark: boolean;
  setDarkMode: (isDark: boolean) => void;
  currentThemeId: string;
  setTheme: (themeId: string) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  setDarkMode: () => {},
  currentThemeId: 'default',
  setTheme: () => {},
  availableThemes: [],
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDark, setIsDark] = useState(false);
  const [currentThemeId, setCurrentThemeId] = useState('default');
  const [availableThemes, setAvailableThemes] = useState<Theme[]>([
    {
      id: 'default',
      name: 'Default Blue',
      primaryColor: '#3498db',
      secondaryColor: '#2980b9',
    },
    {
      id: 'green',
      name: 'Green',
      primaryColor: '#2ecc71',
      secondaryColor: '#27ae60',
    },
    {
      id: 'purple',
      name: 'Purple',
      primaryColor: '#9b59b6',
      secondaryColor: '#8e44ad',
    }
  ]);

  // Apply dark mode
  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDark(isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Apply theme
  useEffect(() => {
    const savedThemeId = localStorage.getItem('themeId') || 'default';
    setCurrentThemeId(savedThemeId);
    
    const theme = availableThemes.find(t => t.id === savedThemeId) || availableThemes[0];
    
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    if (theme.secondaryColor) {
      document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
    }
  }, [availableThemes]);

  // Load user themes
  useEffect(() => {
    const loadUserThemes = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const userThemes = await themeService.getUserThemes(userId);
          setAvailableThemes(prev => [...prev, ...userThemes]);
        }
      } catch (error) {
        console.error('Failed to load user themes', error);
      }
    };
    
    loadUserThemes();
  }, []);

  const setDarkMode = (isDark: boolean) => {
    setIsDark(isDark);
    localStorage.setItem('darkMode', isDark.toString());
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setTheme = (themeId: string) => {
    setCurrentThemeId(themeId);
    localStorage.setItem('themeId', themeId);
    
    const theme = availableThemes.find(t => t.id === themeId) || availableThemes[0];
    
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    if (theme.secondaryColor) {
      document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
    }
  };

  return (
    <ThemeContext.Provider value={{
      isDark,
      setDarkMode,
      currentThemeId,
      setTheme,
      availableThemes
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
