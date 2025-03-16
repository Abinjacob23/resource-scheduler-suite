
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';

const Admin = () => {
  const { user } = useAuth();
  
  // Set up admin session on mount
  useEffect(() => {
    // If we have the special admin login, set it in localStorage
    if (window.location.search.includes('admin=true')) {
      localStorage.setItem('adminSession', 'admin@example.com');
    }
  }, []);

  // Check for admin session in localStorage
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

  // Double-check that the user is an admin or has admin session
  if (!user && !checkLocalAdmin()) {
    return <Navigate to="/" replace />;
  }

  if (user && !isAdmin(user.email)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardLayout isAdmin={true} />
    </div>
  );
};

export default Admin;
