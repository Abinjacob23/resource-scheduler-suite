
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { isFaculty, isAdmin } from '@/utils/admin-utils';

const Header = () => {
  const { user, signOut } = useAuth();
  const [isAdministrator, setIsAdministrator] = useState(false);
  const [isFacultyMember, setIsFacultyMember] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      // Check if user is an administrator (starts with admin@)
      setIsAdministrator(isAdmin(user.email));
      
      // Check if user is a faculty member (starts with hod@)
      setIsFacultyMember(isFaculty(user.email));
    } else {
      // Check for admin or faculty session in localStorage
      const adminSession = localStorage.getItem('adminSession');
      const facultySession = localStorage.getItem('facultySession');
      
      setIsAdministrator(!!adminSession && adminSession.startsWith('admin@'));
      setIsFacultyMember(!!facultySession && facultySession.startsWith('hod@'));
    }
  }, [user]);
  
  const handleSignOut = async () => {
    if (localStorage.getItem('adminSession')) {
      localStorage.removeItem('adminSession');
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your administrator account."
      });
      navigate('/auth');
      return;
    }
    
    if (localStorage.getItem('facultySession')) {
      localStorage.removeItem('facultySession');
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your faculty account."
      });
      navigate('/auth');
      return;
    }
    
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account."
      });
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <header className="dashboard-header sticky top-0 z-10 bg-background border-b border-border p-4 flex items-center justify-between">
      <div className="flex-1">
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        {(user || localStorage.getItem('adminSession') || localStorage.getItem('facultySession')) && (
          <>
            <span className="text-sm text-muted-foreground">
              {user?.email || localStorage.getItem('adminSession') || localStorage.getItem('facultySession')}
              {isAdministrator && " (Administrator)"}
              {isFacultyMember && " (Faculty)"}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="flex items-center gap-1"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
