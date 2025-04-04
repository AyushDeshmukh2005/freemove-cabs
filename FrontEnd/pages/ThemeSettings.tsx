
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { useToast } from '../hooks/use-toast';
import { Palette, Check, Sun, Moon, Trash2, Plus } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '../components/ui/dialog';
import { Separator } from '../components/ui/separator';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { Theme } from '../context/ThemeContext';

const ThemeSettings = () => {
  const { themes, currentTheme, isDarkMode, changeTheme, toggleDarkMode, createCustomTheme, deleteTheme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [newThemeDialogOpen, setNewThemeDialogOpen] = useState(false);
  const [newTheme, setNewTheme] = useState({
    name: '',
    primaryColor: '#0f766e',
    secondaryColor: '#1e293b',
    darkMode: false,
    userId: user?.id || ''
  });
  
  const systemThemes = themes.filter(theme => theme.userId === 'system');
  const userThemes = themes.filter(theme => theme.userId === user?.id);
  
  const handleCreateTheme = async () => {
    if (!newTheme.name || !user?.id) {
      toast({
        title: "Theme Name Required",
        description: "Please provide a name for your custom theme.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await createCustomTheme({
        name: newTheme.name,
        primaryColor: newTheme.primaryColor,
        secondaryColor: newTheme.secondaryColor,
        darkMode: newTheme.darkMode,
        userId: user.id
      });
      
      setNewThemeDialogOpen(false);
      
      toast({
        title: "Theme Created",
        description: "Your custom theme has been created successfully.",
      });
      
      // Reset form
      setNewTheme({
        name: '',
        primaryColor: '#0f766e',
        secondaryColor: '#1e293b',
        darkMode: false,
        userId: user.id
      });
    } catch (error) {
      toast({
        title: "Failed to Create Theme",
        description: "There was an error creating your custom theme.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteTheme = async (themeId: string) => {
    try {
      const success = await deleteTheme(themeId);
      
      if (success) {
        toast({
          title: "Theme Deleted",
          description: "The custom theme has been deleted.",
        });
      } else {
        toast({
          title: "Cannot Delete Theme",
          description: "System themes cannot be deleted.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete the custom theme.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Theme Settings</h1>
          </div>
          
          <div className="bg-white dark:bg-gocabs-secondary/30 rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                <Palette className="h-5 w-5 inline mr-2" />
                Display Mode
              </h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? (
                  <>
                    <Sun className="h-4 w-4 mr-2" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 mr-2" />
                    Dark Mode
                  </>
                )}
              </Button>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              Choose between light and dark mode for your GoCabs experience.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gocabs-secondary/30 rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Default Themes</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {systemThemes.map((theme) => (
                <div 
                  key={theme.id}
                  className={`relative border ${currentTheme.id === theme.id ? 'border-gocabs-primary' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4 cursor-pointer hover:border-gocabs-primary transition-colors`}
                  onClick={() => changeTheme(theme.id)}
                >
                  {currentTheme.id === theme.id && (
                    <div className="absolute top-2 right-2">
                      <Check className="h-5 w-5 text-gocabs-primary" />
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <h3 className="font-medium text-gray-800 dark:text-white">{theme.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {theme.darkMode ? 'Dark mode' : 'Light mode'}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <div 
                      className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-700" 
                      style={{ backgroundColor: theme.primaryColor }}
                      title="Primary color"
                    />
                    <div 
                      className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-700" 
                      style={{ backgroundColor: theme.secondaryColor }}
                      title="Secondary color"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <Separator className="my-6" />
            
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Your Custom Themes</h2>
              <Button 
                size="sm"
                onClick={() => setNewThemeDialogOpen(true)}
                className="bg-gocabs-primary hover:bg-gocabs-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Theme
              </Button>
            </div>
            
            {userThemes.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                <Palette className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  You haven't created any custom themes yet.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => setNewThemeDialogOpen(true)}
                >
                  Create Your First Theme
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userThemes.map((theme) => (
                  <div 
                    key={theme.id}
                    className={`relative border ${currentTheme.id === theme.id ? 'border-gocabs-primary' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4 cursor-pointer hover:border-gocabs-primary transition-colors`}
                    onClick={() => changeTheme(theme.id)}
                  >
                    {currentTheme.id === theme.id && (
                      <div className="absolute top-2 right-2">
                        <Check className="h-5 w-5 text-gocabs-primary" />
                      </div>
                    )}
                    
                    <div className="flex justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-white">{theme.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {theme.darkMode ? 'Dark mode' : 'Light mode'}
                        </p>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-500 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTheme(theme.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex space-x-2">
                      <div 
                        className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-700" 
                        style={{ backgroundColor: theme.primaryColor }}
                        title="Primary color"
                      />
                      <div 
                        className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-700" 
                        style={{ backgroundColor: theme.secondaryColor }}
                        title="Secondary color"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* New Theme Dialog */}
      <Dialog open={newThemeDialogOpen} onOpenChange={setNewThemeDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Custom Theme</DialogTitle>
            <DialogDescription>
              Design your own theme with custom colors and mode preference.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="theme-name">Theme Name</Label>
              <Input 
                id="theme-name" 
                value={newTheme.name} 
                onChange={(e) => setNewTheme({...newTheme, name: e.target.value})}
                placeholder="My Custom Theme"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="primary-color" 
                  type="color" 
                  value={newTheme.primaryColor} 
                  onChange={(e) => setNewTheme({...newTheme, primaryColor: e.target.value})}
                  className="w-12 h-10 p-1"
                />
                <Input 
                  type="text" 
                  value={newTheme.primaryColor} 
                  onChange={(e) => setNewTheme({...newTheme, primaryColor: e.target.value})}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="secondary-color" 
                  type="color" 
                  value={newTheme.secondaryColor} 
                  onChange={(e) => setNewTheme({...newTheme, secondaryColor: e.target.value})}
                  className="w-12 h-10 p-1"
                />
                <Input 
                  type="text" 
                  value={newTheme.secondaryColor} 
                  onChange={(e) => setNewTheme({...newTheme, secondaryColor: e.target.value})}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>Theme Mode</Label>
              <RadioGroup 
                value={newTheme.darkMode ? "dark" : "light"} 
                onValueChange={(value) => setNewTheme({...newTheme, darkMode: value === "dark"})}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light" className="flex items-center cursor-pointer">
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark" className="flex items-center cursor-pointer">
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setNewThemeDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCreateTheme} className="bg-gocabs-primary hover:bg-gocabs-primary/90">
              Create Theme
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ThemeSettings;
