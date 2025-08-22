import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { href: '/', label: 'Home' },
    { href: '/announcements', label: 'Announcements' },
    { href: '/about', label: 'About' },
    { href: '/results', label: 'Results' },
    { href: '/past-results', label: 'Past Results' },
    { href: '/registration', label: 'Registration' },
    { href: '/registered-schools', label: 'Registered Schools' },
    { href: '/participation', label: 'Participation' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="bg-card border-b border-border shadow-educational sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg text-primary">TASSA</span>
              <span className="text-xs text-muted-foreground leading-none">Tanzania Socratic Series</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'nav-link px-3 py-2 rounded-md text-sm',
                  isActiveLink(item.href) && 'nav-link-active'
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/admin">
              <Button variant="outline" size="sm" className="ml-4">
                Admin Login
              </Button>
            </Link>
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
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'nav-link px-3 py-2 rounded-md text-sm block',
                    isActiveLink(item.href) && 'nav-link-active'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link to="/admin" onClick={() => setIsOpen(false)}>
                <Button variant="outline" size="sm" className="mt-2 w-full">
                  Admin Login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;