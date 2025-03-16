
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';

const Header = () => {
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  
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
    try {
      // Clear admin session if it exists
      localStorage.removeItem('adminSession');
      
      // Regular signOut for authenticated users
      if (user) {
        await signOut();
      }
      
      toast.success('Signed out successfully');
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
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
            {isAdmin && !window.location.pathname.includes('/admin') && (
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  Admin Panel
                </Button>
              </Link>
            )}
            <span className="text-sm text-muted-foreground">
              {user?.email || localStorage.getItem('adminSession')}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
