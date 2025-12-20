import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="bg-card border-b border-border shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg text-primary">TASSA</span>
              <span className="text-xs text-muted-foreground leading-none">Socratic Schools</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary border-b-2 border-primary pb-1' : 'text-foreground'
              }`}
            >
              Home
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={`text-sm font-medium flex items-center space-x-1 ${
                    ['/results', '/submit-results'].some(path => isActive(path)) 
                      ? 'text-primary' 
                      : 'text-foreground'
                  }`}
                >
                  <span>Results</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/results">View Results</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/submit-results">Submit Results</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={`text-sm font-medium flex items-center space-x-1 ${
                    ['/registration', '/participation', '/registered-schools'].some(path => isActive(path)) 
                      ? 'text-primary' 
                      : 'text-foreground'
                  }`}
                >
                  <span>Schools</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/registration">Register School</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/participation">Confirm Participation</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/registered-schools">View Registered Schools</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link 
              to="/payment-status" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/payment-status') ? 'text-primary border-b-2 border-primary pb-1' : 'text-foreground'
              }`}
            >
              Payment Status
            </Link>
            
            <Link 
              to="/about" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/about') ? 'text-primary border-b-2 border-primary pb-1' : 'text-foreground'
              }`}
            >
              About
            </Link>
            
            <Link 
              to="/contact" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/contact') ? 'text-primary border-b-2 border-primary pb-1' : 'text-foreground'
              }`}
            >
              Contact
            </Link>
            
            <Link 
              to="/store" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/store') ? 'text-primary border-b-2 border-primary pb-1' : 'text-foreground'
              }`}
            >
              Store
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{user.email?.split('@')[0]}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link to="/admin">Admin Panel</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link 
                to="/auth" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/auth') ? 'text-primary border-b-2 border-primary pb-1' : 'text-foreground'
                }`}
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border mt-2">
            <div className="flex flex-col space-y-1 pt-2">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/') ? 'text-primary bg-primary/10' : 'text-foreground'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/results"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/results') ? 'text-primary bg-primary/10' : 'text-foreground'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Current Results
              </Link>
              <Link
                to="/submit-results"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/submit-results') ? 'text-primary bg-primary/10' : 'text-foreground'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Submit Results
              </Link>
              <Link
                to="/registration"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/registration') ? 'text-primary bg-primary/10' : 'text-foreground'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Register School
              </Link>
              <Link
                to="/participation"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/participation') ? 'text-primary bg-primary/10' : 'text-foreground'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Confirm Participation
              </Link>
              <Link
                to="/registered-schools"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/registered-schools') ? 'text-primary bg-primary/10' : 'text-foreground'
                }`}
                onClick={() => setIsOpen(false)}
              >
                View Registered Schools
              </Link>
              <Link
                to="/payment-status"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/payment-status') ? 'text-primary bg-primary/10' : 'text-foreground'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Payment Status
              </Link>
              <Link
                to="/about"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/about') ? 'text-primary bg-primary/10' : 'text-foreground'
                }`}
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/contact') ? 'text-primary bg-primary/10' : 'text-foreground'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/store"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/store') ? 'text-primary bg-primary/10' : 'text-foreground'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Store
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/admin') ? 'text-primary bg-primary/10' : 'text-foreground'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Panel
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="text-left justify-start px-3 py-2"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/auth') ? 'text-primary bg-primary/10' : 'text-foreground'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;