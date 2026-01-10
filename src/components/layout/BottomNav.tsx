import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, CheckSquare, ListTodo, BarChart3, Settings } from "lucide-react";

const navItems = [
  { to: "/home", icon: Home, label: "Home" },
  { to: "/log", icon: CheckSquare, label: "Today" },
  { to: "/habits", icon: ListTodo, label: "Habits" },
  { to: "/insights", icon: BarChart3, label: "Insights" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "bottom-nav-item",
                isActive && "bottom-nav-item-active"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
              <span className={cn(isActive && "text-primary font-medium")}>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
