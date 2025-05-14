
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex flex-1 mt-16"> {/* Changed pt-16 to mt-16 to create proper spacing */}
          <Sidebar />
          <div className={cn(
            "flex-1 px-4 py-6 md:px-6 lg:px-8 max-w-screen-2xl mx-auto w-full"
          )}>
            {children}
          </div>
        </div>
        <Toaster />
        <Sonner />
      </div>
    </TooltipProvider>
  );
};
