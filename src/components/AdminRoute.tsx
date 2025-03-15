
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

export const AdminRoute = () => {
  const { user, isLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [checkingAdmin, setCheckingAdmin] = useState<boolean>(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setCheckingAdmin(false);
        return;
      }

      try {
        // In a real app, you would check against a roles table
        // For now, we're using emails to determine admin access
        // Replace this with your actual admin emails
        const adminEmails = ['admin@example.com', 'test@example.com'];
        setIsAdmin(adminEmails.includes(user.email || ''));
      } catch (error) {
        console.error('Error checking admin status:', error);
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  if (isLoading || checkingAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
