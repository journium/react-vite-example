import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, CheckSquare, ListTodo, BarChart3, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { to: "/home", icon: Home, label: "Dashboard" },
  { to: "/log", icon: CheckSquare, label: "Today" },
  { to: "/habits", icon: ListTodo, label: "Habits" },
  { to: "/insights", icon: BarChart3, label: "Insights" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 border-r bg-sidebar transition-transform duration-300 lg:sticky lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 lg:hidden">
            <span className="font-semibold">Menu</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1 p-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={cn(
                    "nav-item",
                    isActive && "nav-item-active"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Looply v1.0 (Demo)
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
