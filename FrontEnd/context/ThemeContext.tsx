
import React, { createContext, useState, useContext, useEffect } from 'react';
import { themeService, Theme, defaultTheme } from '../services/themeService';

export type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  customTheme: Theme | null;
  saveCustomTheme: (theme: Omit<Theme, "id">) => Promise<Theme>;
  resetToDefaultTheme: () => void;
  isCustomTheme: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  colors: {
    primary: '#3a86ff',
    secondary: '#ff006e',
    accent: '#ffbe0b',
    background: '#ffffff',
    text: '#333333',
  },
  isDarkMode: false,
  toggleDarkMode: () => {},
  customTheme: null,
  saveCustomTheme: async () => defaultTheme,
  resetToDefaultTheme: () => {},
  isCustomTheme: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<string>('system');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [customTheme, setCustomTheme] = useState<Theme | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Load user theme preference on mount
  useEffect(() => {
    const loadThemePreferences = async () => {
      try {
        // Get user's theme preference from localStorage or API
        const savedTheme = localStorage.getItem('theme') || 'system';
        setThemeState(savedTheme);
        
        // Check if user has a custom theme
        const userTheme = await themeService.getUserTheme();
        if (userTheme) {
          setCustomTheme(userTheme);
        }
        
        // Apply the theme
        applyTheme(savedTheme);
      } catch (error) {
        console.error('Error loading theme preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadThemePreferences();
  }, []);
  
  // Watch for system theme changes
  useEffect(() => {
    if (theme === 'system') {
      const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
      const updateSystemTheme = (e: MediaQueryListEvent) => {
        setIsDarkMode(e.matches);
        applySystemTheme(e.matches);
      };
      
      systemDarkMode.addEventListener('change', updateSystemTheme);
      setIsDarkMode(systemDarkMode.matches);
      applySystemTheme(systemDarkMode.matches);
      
      return () => {
        systemDarkMode.removeEventListener('change', updateSystemTheme);
      };
    }
  }, [theme]);
  
  const applySystemTheme = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const applyTheme = (themeName: string) => {
    localStorage.setItem('theme', themeName);
    
    if (themeName === 'system') {
      const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(systemDarkMode);
      applySystemTheme(systemDarkMode);
    } else if (themeName === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  };
  
  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };
  
  const toggleDarkMode = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setTheme(newTheme);
  };
  
  const saveCustomTheme = async (themeData: Omit<Theme, "id">): Promise<Theme> => {
    try {
      const savedTheme = await themeService.saveTheme({
        ...themeData,
        userId: 'current-user' // This would normally be the authenticated user's ID
      });
      
      setCustomTheme(savedTheme);
      return savedTheme;
    } catch (error) {
      console.error('Error saving custom theme:', error);
      throw new Error('Failed to save custom theme');
    }
  };
  
  const resetToDefaultTheme = () => {
    setCustomTheme(null);
    themeService.resetToDefaultTheme();
  };
  
  const colors = customTheme ? {
    primary: customTheme.primaryColor,
    secondary: customTheme.secondaryColor,
    accent: customTheme.accentColor,
    background: isDarkMode ? customTheme.darkBackgroundColor : customTheme.lightBackgroundColor,
    text: isDarkMode ? customTheme.darkTextColor : customTheme.lightTextColor,
  } : {
    primary: '#3a86ff',
    secondary: '#ff006e',
    accent: '#ffbe0b',
    background: isDarkMode ? '#121212' : '#ffffff',
    text: isDarkMode ? '#f5f5f5' : '#333333',
  };
  
  if (isLoading) {
    // You could return a loading state or null
    return null;
  }
  
  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        colors,
        isDarkMode,
        toggleDarkMode,
        customTheme,
        saveCustomTheme,
        resetToDefaultTheme,
        isCustomTheme: !!customTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
