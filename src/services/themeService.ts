
import { databaseService } from "./databaseService";

export type Theme = {
  id: string;
  userId: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  darkMode: boolean;
  isDark?: boolean; // For compatibility with existing code
};

// Default themes
const defaultThemes: Omit<Theme, "userId" | "id">[] = [
  {
    name: "Default Light",
    primaryColor: "#0f766e", // teal-700 (default GoCabs primary)
    secondaryColor: "#1e293b", // slate-800 (default GoCabs secondary)
    darkMode: false
  },
  {
    name: "Default Dark",
    primaryColor: "#0d9488", // teal-600 (default GoCabs primary for dark)
    secondaryColor: "#0f172a", // slate-900 (default GoCabs secondary for dark)
    darkMode: true
  },
  {
    name: "Purple Haze",
    primaryColor: "#7c3aed", // violet-600
    secondaryColor: "#2e1065", // violet-950
    darkMode: true
  },
  {
    name: "Ocean Blue",
    primaryColor: "#0284c7", // sky-600
    secondaryColor: "#075985", // sky-800
    darkMode: false
  },
  {
    name: "Forest Green",
    primaryColor: "#16a34a", // green-600
    secondaryColor: "#14532d", // green-900
    darkMode: false
  },
  {
    name: "Sunset Orange",
    primaryColor: "#ea580c", // orange-600
    secondaryColor: "#7c2d12", // orange-900
    darkMode: true
  }
];

// Initialize default themes in the database if not already present
const initializeDefaultThemes = () => {
  const themes = databaseService.getAll<Theme>("themePreferences");
  if (themes.length === 0) {
    defaultThemes.forEach((theme, index) => {
      databaseService.add<Theme>("themePreferences", `default-${index}`, {
        ...theme,
        id: `default-${index}`,
        userId: "system"
      });
    });
  }
};

// Initialize default themes
initializeDefaultThemes();

export const themeService = {
  // Get all available themes
  getAllThemes: (): Promise<Theme[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const themes = databaseService.getAll<Theme>("themePreferences");
        resolve(themes);
      }, 300);
    });
  },

  // Get themes for a specific user
  getUserThemes: (userId: string): Promise<Theme[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const systemThemes = databaseService.getAll<Theme>("themePreferences")
          .filter(theme => theme.userId === "system");
        
        const userThemes = databaseService.getAll<Theme>("themePreferences")
          .filter(theme => theme.userId === userId);
        
        resolve([...systemThemes, ...userThemes]);
      }, 300);
    });
  },

  // Create a custom theme
  createTheme: (theme: Omit<Theme, "id">): Promise<Theme> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const id = Math.random().toString(36).substring(2, 15);
        const newTheme = { ...theme, id };
        const result = databaseService.add<Theme>("themePreferences", id, newTheme);
        resolve(result);
      }, 300);
    });
  },

  // Update an existing theme
  updateTheme: (id: string, updates: Partial<Theme>): Promise<Theme | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = databaseService.update<Theme>("themePreferences", id, updates);
        resolve(result);
      }, 300);
    });
  },

  // Delete a theme
  deleteTheme: (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Prevent deletion of system themes
        const theme = databaseService.get<Theme>("themePreferences", id);
        if (theme && theme.userId === "system") {
          resolve(false);
          return;
        }
        
        const result = databaseService.delete("themePreferences", id);
        resolve(result);
      }, 300);
    });
  }
};
