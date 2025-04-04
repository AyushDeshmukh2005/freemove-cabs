
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { themeService, Theme } from '@/services/themeService';
import { useAuth } from './AuthContext';

export interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  userTheme: Theme | null;
  saveTheme: (theme: Omit<Theme, "id">) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState('system');
  const [userTheme, setUserTheme] = useState<Theme | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  
  // Effect for system theme preference
  useEffect(() => {
    // Apply system theme on component mount
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, [prefersDark]);
  
  // Effect to apply theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    let appliedTheme = theme;
    // If system preference, determine if should be dark/light
    if (theme === 'system') {
      appliedTheme = prefersDark ? 'dark' : 'light';
    }
    
    root.classList.add(appliedTheme);
    localStorage.setItem('theme', theme);
    
    // If the user has a custom theme, apply those colors as CSS variables
    if (userTheme) {
      if (userTheme.primaryColor) {
        document.documentElement.style.setProperty('--gocabs-primary', userTheme.primaryColor);
      }
      if (userTheme.secondaryColor) {
        document.documentElement.style.setProperty('--gocabs-secondary', userTheme.secondaryColor);
      }
      if (userTheme.accentColor) {
        document.documentElement.style.setProperty('--gocabs-accent', userTheme.accentColor);
      }
    }
  }, [theme, prefersDark, userTheme]);
  
  // Load user theme from API when user is authenticated
  useEffect(() => {
    const fetchUserTheme = async () => {
      if (!user) {
        setUserTheme(null);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const theme = await themeService.getUserTheme(user.id);
        setUserTheme(theme);
      } catch (err) {
        console.error('Error fetching user theme:', err);
        setError('Failed to load theme settings');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserTheme();
  }, [user]);
  
  const saveTheme = async (themeData: Omit<Theme, "id">) => {
    if (!user) {
      setError('Must be logged in to save themes');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      let savedTheme: Theme;
      
      if (userTheme?.id) {
        // Update existing theme
        savedTheme = await themeService.updateTheme(userTheme.id, {
          ...themeData,
          userId: user.id
        });
      } else {
        // Create new theme
        savedTheme = await themeService.createTheme({
          ...themeData,
          userId: user.id
        });
      }
      
      setUserTheme(savedTheme);
    } catch (err) {
      console.error('Error saving theme:', err);
      setError('Failed to save theme settings');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        userTheme,
        saveTheme,
        isLoading,
        error
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};
