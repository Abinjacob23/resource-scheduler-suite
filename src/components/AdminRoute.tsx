
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  if (!user && !checkLocalAdmin()) {
    return <Navigate to="/" replace />;
  }

  if (user && !isAdmin(user.email)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
