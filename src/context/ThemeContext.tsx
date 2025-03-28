
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { themeService, Theme } from '@/services/themeService';
import { useAuth } from './AuthContext';

type ThemeContextType = {
  themes: Theme[];
  currentTheme: Theme;
  isDarkMode: boolean;
  isLoading: boolean;
  changeTheme: (themeId: string) => void;
  toggleDarkMode: () => void;
  createCustomTheme: (theme: Omit<Theme, 'id' | 'userId'>) => Promise<Theme>;
  deleteTheme: (themeId: string) => Promise<boolean>;
};

const defaultTheme: Theme = {
  id: 'default-light',
  userId: 'system',
  name: 'Default Light',
  primaryColor: '#0f766e', // teal-700
  secondaryColor: '#1e293b', // slate-800
  darkMode: false
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Apply theme to document
  const applyTheme = (theme: Theme) => {
    document.documentElement.style.setProperty('--color-primary', theme.primaryColor);
    document.documentElement.style.setProperty('--color-secondary', theme.secondaryColor);
    
    // Apply dark mode
    if (theme.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    setIsDarkMode(theme.darkMode);
    setCurrentTheme(theme);
    
    // Save preference
    localStorage.setItem('gocabs-theme', theme.id);
  };

  // Load user themes
  useEffect(() => {
    const loadThemes = async () => {
      setIsLoading(true);
      try {
        // Get all available themes (both system and user-specific)
        const availableThemes = user 
          ? await themeService.getUserThemes(user.id)
          : await themeService.getAllThemes();
        
        setThemes(availableThemes);
        
        // Check if user has a saved theme preference
        const savedThemeId = localStorage.getItem('gocabs-theme');
        
        if (savedThemeId) {
          const savedTheme = availableThemes.find(t => t.id === savedThemeId);
          if (savedTheme) {
            applyTheme(savedTheme);
          }
        } else {
          // Default to system preference for dark/light mode
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          
          // Find the default theme that matches the preference
          const defaultTheme = availableThemes.find(t => 
            t.userId === 'system' && t.darkMode === prefersDark
          );
          
          if (defaultTheme) {
            applyTheme(defaultTheme);
          }
        }
      } catch (error) {
        console.error('Failed to load themes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadThemes();
  }, [user]);

  // Change theme
  const changeTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      applyTheme(theme);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    // Find the equivalent theme with opposite dark mode setting
    const targetDarkMode = !isDarkMode;
    
    let newTheme: Theme | undefined;
    
    // First try to find a theme with the same name but opposite dark mode
    if (currentTheme.name.includes('Default')) {
      newTheme = themes.find(t => 
        t.userId === 'system' && 
        t.darkMode === targetDarkMode &&
        t.name.includes('Default')
      );
    }
    
    // If no matching theme, just pick any theme with the right dark mode setting
    if (!newTheme) {
      newTheme = themes.find(t => t.darkMode === targetDarkMode);
    }
    
    if (newTheme) {
      applyTheme(newTheme);
    } else {
      // Just toggle dark mode on the current theme as fallback
      document.documentElement.classList.toggle('dark');
      setIsDarkMode(targetDarkMode);
    }
  };

  // Create a custom theme
  const createCustomTheme = async (theme: Omit<Theme, 'id' | 'userId'>): Promise<Theme> => {
    if (!user) {
      throw new Error('Must be logged in to create a custom theme');
    }
    
    try {
      const newTheme = await themeService.createTheme({
        ...theme,
        userId: user.id
      });
      
      // Update themes list
      setThemes(prevThemes => [...prevThemes, newTheme]);
      
      return newTheme;
    } catch (error) {
      console.error('Failed to create theme:', error);
      throw error;
    }
  };

  // Delete a theme
  const deleteTheme = async (themeId: string): Promise<boolean> => {
    try {
      const success = await themeService.deleteTheme(themeId);
      
      if (success) {
        // Update themes list
        setThemes(prevThemes => prevThemes.filter(t => t.id !== themeId));
        
        // If the deleted theme was the current one, switch to default
        if (currentTheme.id === themeId) {
          const defaultTheme = themes.find(t => t.userId === 'system' && !t.darkMode);
          if (defaultTheme) {
            applyTheme(defaultTheme);
          }
        }
      }
      
      return success;
    } catch (error) {
      console.error('Failed to delete theme:', error);
      return false;
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        themes,
        currentTheme,
        isDarkMode,
        isLoading,
        changeTheme,
        toggleDarkMode,
        createCustomTheme,
        deleteTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
