
import AdminDashboard from "@/components/admin/AdminDashboard";
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Admin = () => {
  const { user } = useAuth();
  
  // Function to check if a user is an admin
  const isAdmin = (email?: string | null) => {
    if (!email) return false;
    // Replace this with your actual admin emails
    const adminEmails = ['admin@example.com', 'test@example.com'];
    return adminEmails.includes(email);
  };

  // Double-check that the user is an admin
  if (!user || !isAdmin(user.email)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminDashboard />
    </div>
  );
};

export default Admin;
