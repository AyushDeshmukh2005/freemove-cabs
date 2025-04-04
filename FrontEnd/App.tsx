
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import AuthGuard from "./components/AuthGuard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup"; 
import Dashboard from "./pages/Dashboard";
import RideTracking from "./pages/RideTracking";
import RideHistory from "./pages/RideHistory";
import NotFound from "./pages/NotFound";
import ThemeSettings from "./pages/ThemeSettings";
import EmergencySettings from "./pages/EmergencySettings";
import DriverRewards from "./pages/DriverRewards";
import NotificationSettings from "./pages/NotificationSettings";
import Subscriptions from "./pages/Subscriptions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={
                <AuthGuard>
                  <Dashboard />
                </AuthGuard>
              } />
              <Route path="/ride/:rideId" element={
                <AuthGuard>
                  <RideTracking />
                </AuthGuard>
              } />
              <Route path="/ride-history" element={
                <AuthGuard>
                  <RideHistory />
                </AuthGuard>
              } />
              <Route path="/theme-settings" element={
                <AuthGuard>
                  <ThemeSettings />
                </AuthGuard>
              } />
              <Route path="/emergency-settings" element={
                <AuthGuard>
                  <EmergencySettings />
                </AuthGuard>
              } />
              <Route path="/driver-rewards" element={
                <AuthGuard>
                  <DriverRewards />
                </AuthGuard>
              } />
              <Route path="/notification-settings" element={
                <AuthGuard>
                  <NotificationSettings />
                </AuthGuard>
              } />
              <Route path="/subscriptions" element={
                <AuthGuard>
                  <Subscriptions />
                </AuthGuard>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
