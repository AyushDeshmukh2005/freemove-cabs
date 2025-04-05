
import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Palette, Moon, Sun, Check, ChevronDown, ChevronUp, Edit, Trash, Plus } from 'lucide-react';

const ThemeSettings = () => {
  const theme = useTheme();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('appearance');
  const [newThemeName, setNewThemeName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#3498db');
  const [isCreatingTheme, setIsCreatingTheme] = useState(false);
  
  const handleToggleDarkMode = () => {
    if (theme.setDarkMode) {
      theme.setDarkMode(!theme.isDark);
    }
  };

  const handleChangeTheme = (themeId: string) => {
    if (theme.setTheme) {
      theme.setTheme(themeId);
    }
  };
  
  const handleCreateTheme = () => {
    toast({
      title: "Theme Created",
      description: "Your custom theme has been created and applied.",
    });
    
    setIsCreatingTheme(false);
    setNewThemeName('');
    setPrimaryColor('#3498db');
  };
  
  const handleDeleteTheme = (themeId: string) => {
    toast({
      title: "Theme Deleted",
      description: "The theme has been removed from your account.",
    });
  };
  
  return (
    <DashboardLayout>
      <div className="container max-w-4xl py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Theme Settings</h1>
            <p className="text-gray-500 mt-1">Customize the appearance of your app</p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="themes">Custom Themes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sun className="mr-2 h-5 w-5" />
                    Mode
                  </CardTitle>
                  <CardDescription>
                    Choose between light and dark mode
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sun className="h-5 w-5 text-amber-500" />
                      <Label htmlFor="dark-mode">Light</Label>
                    </div>
                    <Switch 
                      id="dark-mode"
                      checked={theme.isDark}
                      onCheckedChange={handleToggleDarkMode}
                    />
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="dark-mode">Dark</Label>
                      <Moon className="h-5 w-5 text-indigo-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="mr-2 h-5 w-5" />
                    Color Theme
                  </CardTitle>
                  <CardDescription>
                    Choose a color theme for the application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    defaultValue="blue"
                    className="grid grid-cols-2 gap-4"
                  >
                    <div>
                      <RadioGroupItem value="blue" id="blue" className="sr-only" />
                      <Label
                        htmlFor="blue"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-slate-50 p-4 hover:bg-slate-100 [&:has([data-state=checked])]:border-blue-500"
                      >
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500" />
                        <span className="mt-2">Blue</span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem value="green" id="green" className="sr-only" />
                      <Label
                        htmlFor="green"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-slate-50 p-4 hover:bg-slate-100 [&:has([data-state=checked])]:border-green-500"
                      >
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500" />
                        <span className="mt-2">Green</span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem value="purple" id="purple" className="sr-only" />
                      <Label
                        htmlFor="purple"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-slate-50 p-4 hover:bg-slate-100 [&:has([data-state=checked])]:border-purple-500"
                      >
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500" />
                        <span className="mt-2">Purple</span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem value="amber" id="amber" className="sr-only" />
                      <Label
                        htmlFor="amber"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-slate-50 p-4 hover:bg-slate-100 [&:has([data-state=checked])]:border-amber-500"
                      >
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500" />
                        <span className="mt-2">Amber</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="themes">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Themes</CardTitle>
                  <CardDescription>
                    Create and manage your custom themes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-6 w-6 rounded-full bg-blue-500"></div>
                        <div>
                          <div className="font-medium">Default Blue</div>
                          <div className="text-xs text-gray-500">System Default</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="h-5 w-5 text-green-500" />
                        <span className="text-sm text-green-500">Active</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-6 w-6 rounded-full bg-purple-500"></div>
                        <div>
                          <div className="font-medium">Night Purple</div>
                          <div className="text-xs text-gray-500">Custom Theme</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Trash className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">Activate</Button>
                      </div>
                    </div>
                  </div>
                  
                  {isCreatingTheme ? (
                    <div className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Create New Theme</h3>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setIsCreatingTheme(false)}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="theme-name">Theme Name</Label>
                          <Input
                            id="theme-name"
                            value={newThemeName}
                            onChange={(e) => setNewThemeName(e.target.value)}
                            placeholder="My Custom Theme"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="primary-color">Primary Color</Label>
                          <div className="flex items-center space-x-2">
                            <div 
                              className="h-8 w-8 rounded-full border"
                              style={{backgroundColor: primaryColor}}
                            />
                            <Input
                              id="primary-color"
                              type="color"
                              value={primaryColor}
                              onChange={(e) => setPrimaryColor(e.target.value)}
                              className="w-16 h-8 p-1"
                            />
                            <Input
                              value={primaryColor}
                              onChange={(e) => setPrimaryColor(e.target.value)}
                              className="flex-1"
                              placeholder="#3498db"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button onClick={handleCreateTheme}>
                          Create Theme
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center"
                      onClick={() => setIsCreatingTheme(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Theme
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ThemeSettings;
