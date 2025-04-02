
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFaculty, setIsFaculty] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [association, setAssociation] = useState('');

  const handleRoleChange = (role: 'faculty' | 'admin', checked: boolean) => {
    if (role === 'faculty') {
      setIsFaculty(checked);
      if (checked) {
        setIsAdmin(false);
        setEmail(email.startsWith('admin@') ? 'hod@' + email.substring(6) : 'hod@');
        setAssociation('Faculty');
      } else if (!isAdmin) {
        setEmail(email.startsWith('hod@') ? email.substring(4) : email);
        setAssociation('');
      }
    } else {
      setIsAdmin(checked);
      if (checked) {
        setIsFaculty(false);
        setEmail(email.startsWith('hod@') ? 'admin@' + email.substring(4) : 'admin@');
        setAssociation('Administrator');
      } else if (!isFaculty) {
        setEmail(email.startsWith('admin@') ? email.substring(6) : email);
        setAssociation('');
      }
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Faculty bypass 
      if (email.startsWith('hod@') && password === 'admin123') {
        toast({
          title: "Faculty Access Granted",
          description: "Welcome to the faculty dashboard.",
        });
        // Store faculty session in localStorage
        localStorage.setItem('facultySession', email);
        navigate('/faculty');
        return;
      }
      
      // Admin bypass
      if (email.startsWith('admin@') && password === 'admin123') {
        toast({
          title: "Administrator Access Granted",
          description: "Welcome to the administrator dashboard.",
        });
        // Store admin session in localStorage
        localStorage.setItem('adminSession', email);
        navigate('/admin');
        return;
      }

      // Regular Supabase auth for non-admin users
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      
      // Check if the user is a faculty member or admin and redirect accordingly
      if (email.startsWith('hod@')) {
        navigate('/faculty'); // Faculty dashboard
      } else if (email.startsWith('admin@')) {
        navigate('/admin'); // Admin dashboard
      } else {
        // Regular users go to dashboard
        navigate('/dashboard');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-3">
              <Label className="text-base">Select your role</Label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="faculty" 
                    checked={isFaculty}
                    onCheckedChange={(checked) => handleRoleChange('faculty', checked === true)}
                  />
                  <Label 
                    htmlFor="faculty" 
                    className="text-sm font-normal cursor-pointer"
                  >
                    Faculty (login starts with "hod@")
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="admin" 
                    checked={isAdmin}
                    onCheckedChange={(checked) => handleRoleChange('admin', checked === true)}
                  />
                  <Label 
                    htmlFor="admin" 
                    className="text-sm font-normal cursor-pointer"
                  >
                    Administrator (login starts with "admin@")
                  </Label>
                </div>
              </div>
            </div>
            
            {association && (
              <div className="space-y-2">
                <Label>Selected Association</Label>
                <Input 
                  type="text" 
                  value={association} 
                  readOnly 
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
