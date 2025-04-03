
import axios from 'axios';

export interface Theme {
  id?: string;
  userId: string;
  name: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
  isDark: boolean;
  isCustom: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Get all themes for a user
export const getUserThemes = async (userId: string): Promise<Theme[]> => {
  try {
    const response = await axios.get(`/api/users/${userId}/themes`);
    return response.data.themes;
  } catch (error) {
    console.error('Error fetching user themes:', error);
    throw new Error('Failed to fetch user themes');
  }
};

// Get theme by ID
export const getThemeById = async (themeId: string): Promise<Theme> => {
  try {
    const response = await axios.get(`/api/themes/${themeId}`);
    return response.data.theme;
  } catch (error) {
    console.error('Error fetching theme:', error);
    throw new Error('Failed to fetch theme');
  }
};

// Create a new theme
export const createTheme = async (theme: Omit<Theme, 'id'>): Promise<Theme> => {
  try {
    const response = await axios.post('/api/themes', theme);
    return response.data.theme;
  } catch (error) {
    console.error('Error creating theme:', error);
    throw new Error('Failed to create theme');
  }
};

// Update a theme
export const updateTheme = async (themeId: string, theme: Partial<Theme>): Promise<Theme> => {
  try {
    const response = await axios.patch(`/api/themes/${themeId}`, theme);
    return response.data.theme;
  } catch (error) {
    console.error('Error updating theme:', error);
    throw new Error('Failed to update theme');
  }
};

// Delete a theme
export const deleteTheme = async (themeId: string): Promise<void> => {
  try {
    await axios.delete(`/api/themes/${themeId}`);
  } catch (error) {
    console.error('Error deleting theme:', error);
    throw new Error('Failed to delete theme');
  }
};

// Get the currently active theme for a user
export const getActiveTheme = async (userId: string): Promise<Theme> => {
  try {
    const response = await axios.get(`/api/users/${userId}/active-theme`);
    return response.data.theme;
  } catch (error) {
    console.error('Error fetching active theme:', error);
    throw new Error('Failed to fetch active theme');
  }
};

// Set active theme for a user
export const setActiveTheme = async (userId: string, themeId: string): Promise<void> => {
  try {
    await axios.patch(`/api/users/${userId}/active-theme`, { themeId });
  } catch (error) {
    console.error('Error setting active theme:', error);
    throw new Error('Failed to set active theme');
  }
};

// Get system default themes
export const getDefaultThemes = async (): Promise<Theme[]> => {
  try {
    const response = await axios.get('/api/themes/defaults');
    return response.data.themes;
  } catch (error) {
    console.error('Error fetching default themes:', error);
    throw new Error('Failed to fetch default themes');
  }
};

export const themeService = {
  getUserThemes,
  getThemeById,
  createTheme,
  updateTheme,
  deleteTheme,
  getActiveTheme,
  setActiveTheme,
  getDefaultThemes
};
