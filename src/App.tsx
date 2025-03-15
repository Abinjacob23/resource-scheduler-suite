
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute, AuthRedirect } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Index />} />
            </Route>
            
            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<Admin />} />
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
