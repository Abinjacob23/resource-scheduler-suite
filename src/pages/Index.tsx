
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { isAdmin, isFaculty } from '@/utils/admin-utils';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    // Check for special admin/faculty sessions
    const adminSession = localStorage.getItem('adminSession');
    const facultySession = localStorage.getItem('facultySession');
    
    if (adminSession && adminSession.startsWith('admin@')) {
      navigate('/admin');
      return;
    }
    
    if (facultySession && facultySession.startsWith('hod@')) {
      navigate('/faculty');
      return;
    }
    
    // Redirect based on user role if authenticated
    if (user) {
      if (isAdmin(user.email)) {
        navigate('/admin');
      } else if (isFaculty(user.email)) {
        navigate('/faculty');
      } else {
        navigate('/dashboard');
      }
    } else {
      // If not authenticated, redirect to auth page
      navigate('/auth');
    }
  }, [navigate, user]);

  return (
    <div className="h-screen w-full">
      <DashboardLayout />
    </div>
  );
};

export default Index;
