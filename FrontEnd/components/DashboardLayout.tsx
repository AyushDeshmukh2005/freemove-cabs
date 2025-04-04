
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, LogOut, Home, MapPin, History, Settings, Award, Shield, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex w-full bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-white dark:bg-gray-800 transition-all duration-300 shadow-md hidden md:block`}>
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="p-4 flex flex-col items-center border-b border-gray-200 dark:border-gray-700">
            <Link to="/" className="flex items-center mb-4">
              <div className="p-2 bg-primary rounded-md mr-2">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <span className={`text-xl font-bold text-gray-800 dark:text-white ${!sidebarOpen && 'hidden'}`}>
                GoCabs
              </span>
            </Link>
            <div className={`flex flex-col items-center pt-2 ${!sidebarOpen && 'hidden'}`}>
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-lg">
                {user?.name?.charAt(0) || "U"}
              </div>
              <p className="mt-2 text-sm font-medium dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
          </div>
          
          {/* Sidebar content */}
          <div className="p-4 flex-grow">
            <nav className="space-y-1">
              <Link to="/dashboard" className={`flex items-center p-2 rounded-md ${
                location.pathname === '/dashboard' 
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}>
                <Home className="h-5 w-5" />
                {sidebarOpen && <span className="ml-3">Dashboard</span>}
              </Link>
              
              <Link to="/ride-history" className={`flex items-center p-2 rounded-md ${
                location.pathname === '/ride-history' 
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}>
                <History className="h-5 w-5" />
                {sidebarOpen && <span className="ml-3">Ride History</span>}
              </Link>
              
              <Link to="/emergency-settings" className={`flex items-center p-2 rounded-md ${
                location.pathname === '/emergency-settings' 
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}>
                <Shield className="h-5 w-5" />
                {sidebarOpen && <span className="ml-3">Emergency</span>}
              </Link>
              
              <Link to="/notification-settings" className={`flex items-center p-2 rounded-md ${
                location.pathname === '/notification-settings' 
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}>
                <BellOff className="h-5 w-5" />
                {sidebarOpen && <span className="ml-3">Notifications</span>}
              </Link>
              
              <Link to="/theme-settings" className={`flex items-center p-2 rounded-md ${
                location.pathname === '/theme-settings' 
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}>
                <Settings className="h-5 w-5" />
                {sidebarOpen && <span className="ml-3">Themes</span>}
              </Link>
              
              <Link to="/driver-rewards" className={`flex items-center p-2 rounded-md ${
                location.pathname === '/driver-rewards' 
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}>
                <Award className="h-5 w-5" />
                {sidebarOpen && <span className="ml-3">Rewards</span>}
              </Link>
            </nav>
          </div>
          
          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3">Logout</span>}
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-800 shadow-sm h-16 w-full flex items-center px-4">
          <div className="flex-1 flex">
            <button onClick={toggleSidebar} className="mr-4 md:hidden">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
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
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
            </Button>
          </div>
        </header>
        
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
