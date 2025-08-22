import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, User, Shield, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminPage = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Here you would typically validate against your backend
    if (credentials.username === 'admin' && credentials.password === 'tassa2024') {
      toast({
        title: "Login Successful",
        description: "Welcome to TASSA Admin Dashboard",
      });
      // In a real app, you would redirect to the admin dashboard
    } else {
      setLoginAttempts(prev => prev + 1);
      toast({
        title: "Login Failed",
        description: "Invalid username or password. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen py-16 bg-muted/20">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
            TASSA Admin Portal
          </h1>
          <p className="text-muted-foreground">
            Secure access to administration dashboard
          </p>
        </div>

        {/* Login Form */}
        <Card className="form-section">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-primary" />
              <span>Administrator Login</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="username">Username</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={credentials.username}
                    onChange={handleInputChange}
                    placeholder="Enter admin username"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    placeholder="Enter admin password"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {loginAttempts > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Login attempt failed. {loginAttempts >= 3 && "Multiple failed attempts detected."}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full btn-educational" 
                disabled={isLoading || loginAttempts >= 5}
              >
                {isLoading ? 'Authenticating...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials Info */}
        <Card className="mt-6 border-warning/20 bg-warning-light/10">
          <CardContent className="pt-4">
            <div className="text-center">
              <h3 className="font-semibold text-warning mb-2">Demo Access</h3>
              <p className="text-xs text-muted-foreground mb-3">
                For demonstration purposes only
              </p>
              <div className="text-xs space-y-1 font-mono bg-card p-3 rounded border">
                <p><strong>Username:</strong> admin</p>
                <p><strong>Password:</strong> tassa2024</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Features Preview */}
        <Card className="mt-6 border-primary/20 bg-primary-light/10">
          <CardHeader>
            <CardTitle className="text-center text-lg">Admin Dashboard Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Manage announcements and notifications</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Upload and organize examination results</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>View and manage school registrations</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Monitor participation confirmations</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Access contact form submissions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Generate reports and analytics</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Alert className="mt-6">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-xs">
            This is a secure area. All login attempts are monitored and logged for security purposes.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default AdminPage;