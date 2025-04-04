import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userType, setUserType] = useState<'association' | 'faculty' | 'admin'>('association');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    // Auto-detect user type from email
    if (newEmail.startsWith('hod@')) {
      setUserType('faculty');
    } else if (newEmail.startsWith('admin@')) {
      setUserType('admin');
    } else {
      setUserType('association');
    }
  };

  const handleUserTypeChange = (value: string) => {
    const newType = value as 'association' | 'faculty' | 'admin';
    setUserType(newType);
    
    // Update email prefix based on user type
    let newEmail = email;
    
    // First, remove any existing prefixes
    if (email.startsWith('hod@')) {
      newEmail = email.substring(4);
    } else if (email.startsWith('admin@')) {
      newEmail = email.substring(6);
    }
    
    // Then add the appropriate prefix
    if (newType === 'faculty') {
      newEmail = 'hod@' + newEmail;
    } else if (newType === 'admin') {
      newEmail = 'admin@' + newEmail;
    }
    
    setEmail(newEmail);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Check for the special login cases
      if (userType === 'faculty' && password === 'admin123') {
        toast({
          title: "Faculty Access Granted",
          description: "Welcome to the faculty dashboard.",
        });
        localStorage.setItem('facultySession', email);
        navigate('/faculty');
        return;
      }
      
      if (userType === 'admin' && password === 'admin123') {
        toast({
          title: "Administrator Access Granted",
          description: "Welcome to the administrator dashboard.",
        });
        localStorage.setItem('adminSession', email);
        navigate('/admin');
        return;
      }

      // Regular Supabase auth for association users
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      
      // Regular users go to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md text-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Event Hub</h1>
        <p className="text-muted-foreground">The complete platform for event management</p>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Event Hub
          </CardTitle>
          <CardDescription className="text-center">
            The complete platform for event management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-6">
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
                placeholder="Enter your email" 
                value={email} 
                onChange={handleEmailChange} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter your password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-3">
              <Label>Login as</Label>
              <RadioGroup 
                value={userType} 
                onValueChange={handleUserTypeChange}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="association" id="association" />
                  <Label htmlFor="association" className="cursor-pointer">Association</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="faculty" id="faculty" />
                  <Label htmlFor="faculty" className="cursor-pointer">Faculty</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="admin" />
                  <Label htmlFor="admin" className="cursor-pointer">Administrator</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Button type="submit" className="w-full bg-primary" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center p-6">
          <div className="w-full text-center">
            <a 
              href="#" 
              className="text-primary hover:underline text-sm"
              onClick={(e) => {
                e.preventDefault();
                // Implement sign up functionality here
                toast({
                  title: "Sign up",
                  description: "Sign up functionality coming soon!",
                });
              }}
            >
              Please sign up
            </a>
          </div>
          <div className="mt-6 text-center text-muted-foreground text-sm">
            Event Hub - The complete solution for campus events
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
