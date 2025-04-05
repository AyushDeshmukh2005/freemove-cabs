
import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Sun, Moon, Palette, Trash } from 'lucide-react';

const ThemeSettings = () => {
  const { toast } = useToast();
  const { 
    isDark, 
    setDarkMode, 
    currentThemeId, 
    setTheme, 
    availableThemes 
  } = useTheme();
  
  const [newTheme, setNewTheme] = useState({
    name: '',
    primaryColor: '#3498db',
    secondaryColor: '#2980b9',
    textColor: isDark ? '#ffffff' : '#333333',
    backgroundColor: isDark ? '#121212' : '#ffffff',
    isDark: isDark,
  });
  
  const [isCreating, setIsCreating] = useState(false);
  
  const handleColorChange = (field: string, value: string) => {
    setNewTheme((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleCreateTheme = async () => {
    if (!newTheme.name) {
      toast({
        title: "Theme name required",
        description: "Please provide a name for your theme.",
        variant: "destructive",
      });
      return;
    }
    
    setIsCreating(true);
    
    try {
      // We would normally call a service here to create the theme
      // const createdTheme = await themeService.createTheme({...newTheme, userId: user.id});
      
      toast({
        title: "Theme created",
        description: `Theme "${newTheme.name}" has been created.`,
      });
      
      // Reset form after successful creation
      setNewTheme({
        name: '',
        primaryColor: '#3498db',
        secondaryColor: '#2980b9',
        textColor: isDark ? '#ffffff' : '#333333',
        backgroundColor: isDark ? '#121212' : '#ffffff',
        isDark: isDark,
      });
      
    } catch (error) {
      toast({
        title: "Theme creation failed",
        description: "Failed to create your custom theme.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleDeleteTheme = async (themeId: string) => {
    try {
      // We would normally call a service here to delete the theme
      // await themeService.deleteTheme(themeId);
      
      toast({
        title: "Theme deleted",
        description: "The theme has been deleted.",
      });
      
      // If the deleted theme was selected, switch to default
      if (themeId === currentThemeId) {
        setTheme('default');
      }
      
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete theme.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Appearance Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Customize the appearance of your GoCabs application
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Color Mode</CardTitle>
            <CardDescription>Choose between light and dark mode</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                {isDark ? (
                  <Moon className="h-5 w-5 text-blue-500" />
                ) : (
                  <Sun className="h-5 w-5 text-yellow-500" />
                )}
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
              <Switch
                id="dark-mode"
                checked={isDark}
                onCheckedChange={setDarkMode}
              />
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="built-in">
          <TabsList>
            <TabsTrigger value="built-in">Built-in Themes</TabsTrigger>
            <TabsTrigger value="custom">Custom Theme</TabsTrigger>
          </TabsList>
          
          <TabsContent value="built-in" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableThemes.map((theme) => (
                <div 
                  key={theme.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    theme.id === currentThemeId ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => setTheme(theme.id)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{theme.name}</h3>
                    {theme.id !== 'default' && theme.id !== 'green' && theme.id !== 'purple' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTheme(theme.id);
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash size={16} />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 mt-2">
                    <div 
                      className="h-6 w-6 rounded-full" 
                      style={{ backgroundColor: theme.primaryColor }}
                      title="Primary Color"
                    />
                    {theme.secondaryColor && (
                      <div 
                        className="h-6 w-6 rounded-full" 
                        style={{ backgroundColor: theme.secondaryColor }}
                        title="Secondary Color"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Create Custom Theme
                </CardTitle>
                <CardDescription>Design your own theme with custom colors</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme-name">Theme Name</Label>
                  <Input
                    id="theme-name"
                    value={newTheme.name}
                    onChange={(e) => handleColorChange('name', e.target.value)}
                    placeholder="My Custom Theme"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex space-x-2">
                      <div
                        className="h-9 w-9 rounded border"
                        style={{ backgroundColor: newTheme.primaryColor }}
                      />
                      <Input
                        id="primary-color"
                        type="color"
                        value={newTheme.primaryColor}
                        onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex space-x-2">
                      <div
                        className="h-9 w-9 rounded border"
                        style={{ backgroundColor: newTheme.secondaryColor }}
                      />
                      <Input
                        id="secondary-color"
                        type="color"
                        value={newTheme.secondaryColor}
                        onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="text-color">Text Color</Label>
                    <div className="flex space-x-2">
                      <div
                        className="h-9 w-9 rounded border"
                        style={{ backgroundColor: newTheme.textColor }}
                      />
                      <Input
                        id="text-color"
                        type="color"
                        value={newTheme.textColor}
                        onChange={(e) => handleColorChange('textColor', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="background-color">Background Color</Label>
                    <div className="flex space-x-2">
                      <div
                        className="h-9 w-9 rounded border"
                        style={{ backgroundColor: newTheme.backgroundColor }}
                      />
                      <Input
                        id="background-color"
                        type="color"
                        value={newTheme.backgroundColor}
                        onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button onClick={handleCreateTheme} disabled={isCreating || !newTheme.name}>
                  {isCreating ? "Creating..." : "Create Theme"}
                </Button>
              </CardFooter>
            </Card>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-medium mb-2">Preview</h3>
              <div 
                className="p-4 rounded-lg border"
                style={{ 
                  backgroundColor: newTheme.backgroundColor, 
                  color: newTheme.textColor,
                  borderColor: newTheme.primaryColor
                }}
              >
                <h4 style={{ color: newTheme.primaryColor }}>Theme Preview</h4>
                <p className="mt-2 text-sm">This is how your theme will look like.</p>
                <button 
                  className="mt-3 px-4 py-2 rounded-md text-white"
                  style={{ backgroundColor: newTheme.primaryColor }}
                >
                  Button Example
                </button>
                <button 
                  className="mt-3 ml-2 px-4 py-2 rounded-md text-white"
                  style={{ backgroundColor: newTheme.secondaryColor }}
                >
                  Secondary Button
                </button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ThemeSettings;
