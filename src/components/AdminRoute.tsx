
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { isFaculty, isAdmin, checkLocalFaculty, checkLocalAdmin } from '@/utils/admin-utils';

export const FacultyRoute = () => {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user && !checkLocalFaculty()) {
      toast.error("You don't have access to the faculty area");
    }
    
    if (!isLoading && user && !isFaculty(user.email)) {
      toast.error("Your account doesn't have faculty privileges");
    }
  }, [isLoading, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Verifying faculty access...</span>
      </div>
    );
  }

  if (!user && !checkLocalFaculty()) {
    console.log("Redirecting: No user or faculty session");
    return <Navigate to="/" replace />;
  }

  if (user && !isFaculty(user.email)) {
    console.log("Redirecting: User is not faculty", user.email);
    return <Navigate to="/" replace />;
  }

  console.log("Faculty route access granted");
  return <Outlet />;
};

export const AdminRoute = () => {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user && !checkLocalAdmin()) {
      toast.error("You don't have access to the administrator area");
    }
    
    if (!isLoading && user && !isAdmin(user.email)) {
      toast.error("Your account doesn't have administrator privileges");
    }
  }, [isLoading, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Verifying administrator access...</span>
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
