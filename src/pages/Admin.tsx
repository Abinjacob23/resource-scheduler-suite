
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Loader2 } from 'lucide-react';

const Admin = () => {
  const { user } = useAuth();
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  
  // Function to check if a user is an admin
  const isAdmin = (email?: string | null) => {
    if (!email) return checkLocalAdmin();
    // Replace this with your actual admin emails
    const adminEmails = ['admin@example.com', 'test@example.com', 'admin@gmail.com'];
    return adminEmails.includes(email);
  };

  // Check for admin session in localStorage
  const checkLocalAdmin = () => {
    const adminSession = localStorage.getItem('adminSession');
    return adminSession === 'admin@example.com' || adminSession === 'admin@gmail.com';
  };

  useEffect(() => {
    // If we have the special admin login, set it in localStorage
    if (window.location.search.includes('admin=true')) {
      localStorage.setItem('adminSession', 'admin@gmail.com');
      setIsUserAdmin(true);
      setIsCheckingAdmin(false);
      return;
    }

    const checkAdminStatus = async () => {
      setIsCheckingAdmin(true);
      
      // First check localStorage
      if (checkLocalAdmin()) {
        setIsUserAdmin(true);
        setIsCheckingAdmin(false);
        return;
      }
      
      // Then check user email
      if (user && isAdmin(user.email)) {
        setIsUserAdmin(true);
      } else {
        setIsUserAdmin(false);
      }
      
      setIsCheckingAdmin(false);
    };

    checkAdminStatus();
  }, [user]);

  if (isCheckingAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Verifying admin access...</span>
      </div>
    );
  }

  // Redirect non-admin users
  if (!isUserAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardLayout isAdmin={true} />
    </div>
  );
};

export default Admin;
