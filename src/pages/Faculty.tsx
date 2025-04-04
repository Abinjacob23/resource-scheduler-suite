
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { isFaculty, checkLocalFaculty } from '@/utils/admin-utils';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Faculty = () => {
  const { user } = useAuth();
  const [isCheckingFaculty, setIsCheckingFaculty] = useState(true);
  const [isUserFaculty, setIsUserFaculty] = useState(false);
  
  useEffect(() => {
    // If we have the special faculty login, set it in localStorage
    if (window.location.search.includes('faculty=true')) {
      localStorage.setItem('facultySession', 'hod@example.com');
      setIsUserFaculty(true);
      setIsCheckingFaculty(false);
      return;
    }

    const checkFacultyStatus = async () => {
      setIsCheckingFaculty(true);
      
      // First check localStorage
      if (checkLocalFaculty()) {
        console.log('Faculty access granted via localStorage');
        setIsUserFaculty(true);
        setIsCheckingFaculty(false);
        return;
      }
      
      // Then check user email
      if (user && isFaculty(user.email)) {
        console.log('Faculty access granted via email:', user.email);
        setIsUserFaculty(true);
      } else {
        console.log('Faculty access denied for user:', user?.email);
        setIsUserFaculty(false);
        toast.error('You do not have faculty privileges');
      }
      
      setIsCheckingFaculty(false);
    };

    checkFacultyStatus();
  }, [user]);

  if (isCheckingFaculty) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span className="ml-2 text-lg">Verifying faculty access...</span>
      </div>
    );
  }

  // Redirect non-faculty users
  if (!isUserFaculty) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardLayout isFacultyView={true} />
    </div>
  );
};

export default Faculty;
