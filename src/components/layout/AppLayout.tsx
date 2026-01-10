import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useApp } from "@/lib/store";
import { AppHeader } from "./AppHeader";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

export function AppLayout() {
  const { user, isLoading } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        onMenuClick={() => setSidebarOpen(true)} 
        showMenuButton 
      />
      
      <div className="flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 pb-20 lg:pb-6">
          <div className="container max-w-4xl py-6">
            <Outlet />
          </div>
        </main>
      </div>
      
      <BottomNav />
    </div>
  );
}
