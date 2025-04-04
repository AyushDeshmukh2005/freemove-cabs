
import React, { createContext, useContext, useEffect, useState } from 'react';

// Define theme type
export interface Theme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  darkMode: boolean;
  userId: string;
}

// Define the context type
export interface ThemeContextType {
  themes: Theme[];
  currentTheme: Theme;
  isDarkMode: boolean;
  changeTheme: (themeId: string) => void;
  toggleDarkMode: () => void;
  createCustomTheme: (theme: Omit<Theme, 'id'>) => Promise<void>;
  deleteTheme: (themeId: string) => Promise<boolean>;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType | null>(null);

// Default themes
const defaultThemes: Theme[] = [
  {
    id: 'default-light',
    name: 'Default Light',
    primaryColor: '#0f766e',
    secondaryColor: '#f8fafc',
    darkMode: false,
    userId: 'system'
  },
  {
    id: 'default-dark',
    name: 'Default Dark',
    primaryColor: '#14b8a6',
    secondaryColor: '#1e293b',
    darkMode: true,
    userId: 'system'
  },
  {
    id: 'ocean-light',
    name: 'Ocean Light',
    primaryColor: '#0284c7',
    secondaryColor: '#f0f9ff',
    darkMode: false,
    userId: 'system'
  },
  {
    id: 'ocean-dark',
    name: 'Ocean Dark',
    primaryColor: '#38bdf8',
    secondaryColor: '#0c4a6e',
    darkMode: true,
    userId: 'system'
  }
];

// Mock theme service (replace with real API calls later)
const themeService = {
  getAllThemes: async (): Promise<Theme[]> => {
    const storedThemes = localStorage.getItem('customThemes');
    const customThemes = storedThemes ? JSON.parse(storedThemes) : [];
    return [...defaultThemes, ...customThemes];
  },
  
  getUserThemes: async (userId: string): Promise<Theme[]> => {
    const allThemes = await themeService.getAllThemes();
    return allThemes.filter(theme => theme.userId === userId);
  },
  
  createTheme: async (theme: Omit<Theme, 'id'>): Promise<Theme> => {
    const id = `custom-${Date.now()}`;
    const newTheme = { ...theme, id };
    
    const storedThemes = localStorage.getItem('customThemes');
    const customThemes = storedThemes ? JSON.parse(storedThemes) : [];
    customThemes.push(newTheme);
    localStorage.setItem('customThemes', JSON.stringify(customThemes));
    
    return newTheme;
  },
  
  updateTheme: async (id: string, updates: Partial<Theme>): Promise<Theme> => {
    const storedThemes = localStorage.getItem('customThemes');
    const customThemes = storedThemes ? JSON.parse(storedThemes) : [];
    
    const index = customThemes.findIndex((theme: Theme) => theme.id === id);
    if (index === -1) throw new Error('Theme not found');
    
    customThemes[index] = { ...customThemes[index], ...updates };
    localStorage.setItem('customThemes', JSON.stringify(customThemes));
    
    return customThemes[index];
  },
  
  deleteTheme: async (id: string): Promise<boolean> => {
    if (id.startsWith('default-') || id.startsWith('ocean-')) {
      return false;
    }
    
    const storedThemes = localStorage.getItem('customThemes');
    const customThemes = storedThemes ? JSON.parse(storedThemes) : [];
    
    const filteredThemes = customThemes.filter((theme: Theme) => theme.id !== id);
    localStorage.setItem('customThemes', JSON.stringify(filteredThemes));
    
    return true;
  }
};

// Provider component
export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [themes, setThemes] = useState<Theme[]>(defaultThemes);
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultThemes[0]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  // Load themes on mount
  useEffect(() => {
    const loadThemes = async () => {
      const allThemes = await themeService.getAllThemes();
      setThemes(allThemes);
      
      // Load saved theme preference or use default
      const savedThemeId = localStorage.getItem('currentThemeId') || 'default-light';
      const savedTheme = allThemes.find(theme => theme.id === savedThemeId) || allThemes[0];
      setCurrentTheme(savedTheme);
      setIsDarkMode(savedTheme.darkMode);
      
      applyThemeToDOM(savedTheme);
    };
    
    loadThemes();
  }, []);
  
  // Apply theme to DOM
  const applyThemeToDOM = (theme: Theme) => {
    if (theme.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    document.documentElement.style.setProperty('--color-primary', theme.primaryColor);
    document.documentElement.style.setProperty('--color-secondary', theme.secondaryColor);
    
    // Apply to tailwind classes
    document.documentElement.style.setProperty('--gocabs-primary', theme.primaryColor);
    document.documentElement.style.setProperty('--gocabs-secondary', theme.secondaryColor);
    document.documentElement.style.setProperty('--gocabs-dark', theme.darkMode ? '#0f172a' : '#f8fafc');
  };
  
  // Change theme
  const changeTheme = (themeId: string) => {
    const theme = themes.find(theme => theme.id === themeId);
    if (!theme) return;
    
    setCurrentTheme(theme);
    setIsDarkMode(theme.darkMode);
    localStorage.setItem('currentThemeId', themeId);
    applyThemeToDOM(theme);
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // Find a matching theme with the new dark mode value
    let newTheme: Theme;
    
    if (currentTheme.id.includes('default')) {
      newTheme = themes.find(theme => 
        theme.id === (newDarkMode ? 'default-dark' : 'default-light')
      ) || currentTheme;
    } else if (currentTheme.id.includes('ocean')) {
      newTheme = themes.find(theme => 
        theme.id === (newDarkMode ? 'ocean-dark' : 'ocean-light')
      ) || currentTheme;
    } else {
      // For custom themes, just update the current theme
      newTheme = { ...currentTheme, darkMode: newDarkMode };
    }
    
    setCurrentTheme(newTheme);
    localStorage.setItem('currentThemeId', newTheme.id);
    applyThemeToDOM(newTheme);
  };
  
  // Create custom theme
  const createCustomTheme = async (theme: Omit<Theme, 'id'>) => {
    const newTheme = await themeService.createTheme(theme);
    setThemes([...themes, newTheme]);
    
    setCurrentTheme(newTheme);
    setIsDarkMode(newTheme.darkMode);
    localStorage.setItem('currentThemeId', newTheme.id);
    applyThemeToDOM(newTheme);
  };
  
  // Delete theme
  const deleteTheme = async (themeId: string) => {
    const result = await themeService.deleteTheme(themeId);
    
    if (result) {
      const updatedThemes = themes.filter(theme => theme.id !== themeId);
      setThemes(updatedThemes);
      
      // If current theme was deleted, switch to default
      if (currentTheme.id === themeId) {
        const defaultTheme = updatedThemes[0];
        setCurrentTheme(defaultTheme);
        setIsDarkMode(defaultTheme.darkMode);
        localStorage.setItem('currentThemeId', defaultTheme.id);
        applyThemeToDOM(defaultTheme);
      }
    }
    
    return result;
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

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
