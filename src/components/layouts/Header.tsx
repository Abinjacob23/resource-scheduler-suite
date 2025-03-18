
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const Header = () => {
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      // In a real app, you would check against a roles table
      // For now, we're using emails to determine admin access
      // Replace this with your actual admin emails
      const adminEmails = ['admin@example.com', 'test@example.com', 'admin@gmail.com'];
      setIsAdmin(adminEmails.includes(user.email || ''));
    } else {
      // Check for admin session in localStorage
      const adminSession = localStorage.getItem('adminSession');
      setIsAdmin(adminSession === 'admin@example.com' || adminSession === 'admin@gmail.com');
    }
  }, [user]);
  
  const handleSignOut = async () => {
    if (localStorage.getItem('adminSession')) {
      localStorage.removeItem('adminSession');
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your admin account."
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
        {(user || localStorage.getItem('adminSession')) && (
          <>
            <span className="text-sm text-muted-foreground">
              {user?.email || localStorage.getItem('adminSession')}
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
