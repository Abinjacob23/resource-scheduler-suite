
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Header = () => {
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    if (user) {
      // In a real app, you would check against a roles table
      // For now, we're using emails to determine admin access
      // Replace this with your actual admin emails
      const adminEmails = ['admin@example.com', 'test@example.com'];
      setIsAdmin(adminEmails.includes(user.email || ''));
    } else {
      setIsAdmin(false);
    }
  }, [user]);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };
  
  return (
    <header className="dashboard-header">
      <div className="flex-1">
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <>
            {isAdmin && (
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  Admin Panel
                </Button>
              </Link>
            )}
            <span className="text-sm text-muted-foreground">
              {user.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
