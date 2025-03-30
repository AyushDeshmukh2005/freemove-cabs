
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Bell, LogOut, Home, MapPin, History, Settings, Award, Clock, Shield, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger
} from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 dark:bg-gocabs-dark">
        <Sidebar variant="inset">
          <SidebarHeader className="flex flex-col items-center justify-center p-4">
            <Link to="/" className="flex items-center mb-4">
              <div className="p-2 bg-gocabs-primary rounded-md mr-2">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gocabs-secondary dark:text-white">
                GoCabs
              </span>
            </Link>
            <div className="flex flex-col items-center pt-2">
              <div className="h-12 w-12 rounded-full bg-gocabs-primary/20 flex items-center justify-center text-gocabs-primary font-medium text-lg">
                {user?.name.charAt(0)}
              </div>
              <p className="mt-2 text-sm font-medium dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname === '/dashboard'}
                  tooltip="Dashboard"
                >
                  <Link to="/dashboard">
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname === '/ride-history'}
                  tooltip="Ride History"
                >
                  <Link to="/ride-history">
                    <History className="h-5 w-5" />
                    <span>Ride History</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname === '/emergency-settings'}
                  tooltip="Emergency"
                >
                  <Link to="/emergency-settings">
                    <Shield className="h-5 w-5" />
                    <span>Emergency</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname === '/notification-settings'}
                  tooltip="Notifications"
                >
                  <Link to="/notification-settings">
                    <BellOff className="h-5 w-5" />
                    <span>Notifications</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname === '/theme-settings'}
                  tooltip="Themes"
                >
                  <Link to="/theme-settings">
                    <Settings className="h-5 w-5" />
                    <span>Themes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname === '/driver-rewards'}
                  tooltip="Rewards"
                >
                  <Link to="/driver-rewards">
                    <Award className="h-5 w-5" />
                    <span>Rewards</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="mt-auto">
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span>Logout</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 flex flex-col">
          <header className="bg-white dark:bg-gocabs-secondary shadow-sm h-16 w-full flex items-center px-4">
            <div className="flex-1 flex">
              <SidebarTrigger className="mr-4" />
              <h1 className="text-xl font-semibold text-gocabs-secondary dark:text-white">
                {location.pathname === '/dashboard' && 'Dashboard'}
                {location.pathname === '/ride-history' && 'Ride History'}
                {location.pathname === '/emergency-settings' && 'Emergency Settings'}
                {location.pathname === '/notification-settings' && 'Notification Settings'}
                {location.pathname === '/theme-settings' && 'Theme Settings'}
                {location.pathname === '/driver-rewards' && 'Driver Rewards'}
                {location.pathname.startsWith('/ride/') && 'Ride Tracking'}
              </h1>
            </div>
            <div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-gocabs-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </Button>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
