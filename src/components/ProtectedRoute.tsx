
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { isAdmin, isFaculty } from '@/utils/admin-utils';

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  // Check for admin or faculty session in localStorage
  const adminSession = localStorage.getItem('adminSession');
  const facultySession = localStorage.getItem('facultySession');
  
  if (!user && !adminSession && !facultySession) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export const AuthRedirect = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  // Check for admin or faculty session in localStorage
  const adminSession = localStorage.getItem('adminSession');
  const facultySession = localStorage.getItem('facultySession');
  
  if (user) {
    // Redirect based on user role
    if (isAdmin(user.email)) {
      return <Navigate to="/admin" replace />;
    } else if (isFaculty(user.email)) {
      return <Navigate to="/faculty" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  } else if (adminSession && adminSession.startsWith('admin@')) {
    return <Navigate to="/admin" replace />;
  } else if (facultySession && facultySession.startsWith('hod@')) {
    return <Navigate to="/faculty" replace />;
  }

  return <Outlet />;
};
