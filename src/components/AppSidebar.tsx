import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Trophy,
  Upload,
  School,
  CheckSquare,
  Building2,
  CreditCard,
  Info,
  Mail,
  ShoppingBag,
  CalendarDays,
  Shield,
  LogOut,
  GraduationCap,
  User,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const mainItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "About", url: "/about", icon: Info },
  { title: "Almanac", url: "/almanac", icon: CalendarDays },
  { title: "Contact", url: "/contact", icon: Mail },
];

const resultsItems = [
  { title: "View Results", url: "/results", icon: Trophy },
  { title: "Submit Results", url: "/submit-results", icon: Upload },
];

const schoolItems = [
  { title: "Register School", url: "/registration", icon: School },
  { title: "Confirm Participation", url: "/participation", icon: CheckSquare },
  { title: "Registered Schools", url: "/registered-schools", icon: Building2 },
  { title: "Payment Status", url: "/payment-status", icon: CreditCard },
];

const moreItems = [
  { title: "Store", url: "/store", icon: ShoppingBag },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const isActive = (path: string) => pathname === path;

  const renderGroup = (label: string, items: typeof mainItems) => (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                <NavLink to={item.url} end className="flex items-center gap-2">
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <NavLink to="/" className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shrink-0">
            <GraduationCap className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-sidebar-foreground">TASSA</span>
              <span className="text-[10px] text-sidebar-foreground/60">Socratic Schools</span>
            </div>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        {renderGroup("Main", mainItems)}
        {renderGroup("Results", resultsItems)}
        {renderGroup("Schools", schoolItems)}
        {renderGroup("More", moreItems)}

        {user && (
          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel>Admin</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname.startsWith("/admin")} tooltip="Admin Panel">
                    <NavLink to="/admin" className="flex items-center gap-2">
                      <Shield className="h-4 w-4 shrink-0" />
                      <span>Admin Panel</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        {user ? (
          <div className="flex items-center gap-2 p-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground shrink-0">
              <User className="h-4 w-4" />
            </div>
            {!collapsed && (
              <>
                <span className="flex-1 truncate text-xs text-sidebar-foreground">{user.email?.split("@")[0]}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-sidebar-foreground hover:bg-sidebar-accent"
                  onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Login">
                <NavLink to="/auth" className="flex items-center gap-2">
                  <User className="h-4 w-4 shrink-0" />
                  <span>Login</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}