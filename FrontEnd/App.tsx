
import { Toaster } from "../src/components/ui/toaster";
import { Toaster as Sonner } from "../src/components/ui/sonner";
import { TooltipProvider } from "../src/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../src/context/AuthContext";
import { ThemeProvider } from "../src/context/ThemeContext";
import AuthGuard from "../src/components/AuthGuard";
import Index from "../src/pages/Index";
import Login from "../src/pages/Login";
import Signup from "../src/pages/Signup"; 
import Dashboard from "../src/pages/Dashboard";
import RideTracking from "../src/pages/RideTracking";
import RideHistory from "../src/pages/RideHistory";
import NotFound from "../src/pages/NotFound";
import ThemeSettings from "../src/pages/ThemeSettings";
import EmergencySettings from "../src/pages/EmergencySettings";
import DriverRewards from "../src/pages/DriverRewards";
import NotificationSettings from "../src/pages/NotificationSettings";
import Subscriptions from "../src/pages/Subscriptions";

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
