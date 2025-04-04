
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute, AuthRedirect } from "./components/ProtectedRoute";
import { AdminRoute, FacultyRoute } from "./components/AdminRoute";
import HomePage from "./pages/HomePage";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Faculty from "./pages/Faculty";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/layouts/DashboardLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Route - Landing Page */}
            <Route path="/home" element={<HomePage />} />
            
            {/* Default route redirects to home */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />} />
              <Route path="/dashboard/:tab" element={<DashboardLayout />} />
            </Route>
            
            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
            
            {/* Faculty Routes */}
            <Route element={<FacultyRoute />}>
              <Route path="/faculty" element={<Faculty />} />
            </Route>
            
            {/* Auth Routes */}
            <Route element={<AuthRedirect />}>
              <Route path="/auth" element={<Auth />} />
            </Route>
            
            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
