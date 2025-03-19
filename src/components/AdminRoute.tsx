
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect } from 'react';

export const AdminRoute = () => {
  const { user, isLoading } = useAuth();

  // Check if we have a special admin session in localStorage
  const checkLocalAdmin = () => {
    const adminSession = localStorage.getItem('adminSession');
    return adminSession === 'admin@example.com' || adminSession === 'admin@gmail.com';
  };

  // Function to check if a user is an admin
  const isAdmin = (email?: string | null) => {
    if (!email) return checkLocalAdmin();
    // Replace this with your actual admin emails
    const adminEmails = ['admin@example.com', 'test@example.com', 'admin@gmail.com'];
    return adminEmails.includes(email);
  };

  useEffect(() => {
    // If not logged in or not admin and trying to access admin route
    if (!isLoading && !user && !checkLocalAdmin()) {
      toast.error("You don't have access to the admin area");
    }
    
    if (!isLoading && user && !isAdmin(user.email)) {
      toast.error("Your account doesn't have admin privileges");
    }
  }, [isLoading, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Verifying admin access...</span>
      </div>
    );
  }

  if (!user && !checkLocalAdmin()) {
    console.log("Redirecting: No user or admin session");
    return <Navigate to="/" replace />;
  }

  if (user && !isAdmin(user.email)) {
    console.log("Redirecting: User is not admin", user.email);
    return <Navigate to="/" replace />;
  }

  console.log("Admin route access granted");
  return <Outlet />;
};
