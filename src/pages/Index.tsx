
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to dashboard when this component loads
    navigate('/dashboard');
  }, [navigate]);

  return (
    <div className="h-screen w-full">
      <DashboardLayout />
    </div>
  );
};

export default Index;
