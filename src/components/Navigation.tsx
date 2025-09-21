import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  LayoutDashboard, 
  TrendingUp, 
  FileText, 
  Settings, 
  Bell,
  User,
  LogOut,
  Droplets,
  Menu,
  X
} from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: { displayName?: string; email?: string; name?: string };
  onLogout: () => void;
}

export const Navigation = ({ activeTab, onTabChange, user, onLogout }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, message: "Low water level detected", type: "warning", time: "2 min ago" },
    { id: 2, message: "Irrigation cycle completed", type: "success", time: "15 min ago" },
    { id: 3, message: "Soil moisture optimal", type: "info", time: "1 hour ago" },
  ]);

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "charts", label: "Analytics", icon: TrendingUp },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const unreadNotifications = notifications.filter(n => n.type === "warning").length;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Droplets className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">AgroSmart</h1>
                <p className="text-xs text-muted-foreground">Control Panel</p>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex items-center gap-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    onClick={() => onTabChange(item.id)}
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-4 h-4" />
                    {unreadNotifications > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
                        {unreadNotifications}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-2 font-semibold">Notifications</div>
                  <DropdownMenuSeparator />
                  {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
                      <div className="flex items-center gap-2 w-full">
                        <div className={`w-2 h-2 rounded-full ${
                          notification.type === "warning" ? "bg-irrigation-warning" :
                          notification.type === "success" ? "bg-irrigation-success" :
                          "bg-irrigation-blue"
                        }`} />
                        <span className="text-sm">{notification.message}</span>
                      </div>
                      <span className="text-xs text-muted-foreground ml-4">{notification.time}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 p-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {(user.displayName || user.name || user.email || 'U').split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden lg:block">
                      <div className="text-sm font-medium">{user.displayName || user.name || 'User'}</div>
                      <div className="text-xs text-muted-foreground">{user.email || 'No email'}</div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onTabChange("settings")}>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onTabChange("settings")}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Droplets className="w-5 h-5 text-primary" />
              </div>
              <h1 className="font-bold text-lg text-foreground">AgroSmart</h1>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2">
              {unreadNotifications > 0 && (
                <Badge variant="destructive" className="h-6 w-6 p-0 text-xs">
                  {unreadNotifications}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="mt-4 pb-4 border-t pt-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    onClick={() => {
                      onTabChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                );
              })}
              <div className="pt-2 border-t">
                <div className="flex items-center gap-3 p-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {(user.displayName || user.name || user.email || 'U').split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{user.displayName || user.name || 'User'}</div>
                    <div className="text-xs text-muted-foreground">{user.email || 'No email'}</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={onLogout}
                  className="w-full justify-start gap-2 text-destructive mt-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Spacer for fixed navigation */}
      <div className="h-16 md:h-20" />
    </>
  );
};