
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    // Redirect to dashboard when this component loads
    // Only redirect if the user is authenticated
    if (user) {
      navigate('/dashboard');
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
