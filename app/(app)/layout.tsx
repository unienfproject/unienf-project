"use client";

import ProtectedRoute from "@/app/_components/auth/ProtectedRoute";
import { AppSidebar } from "@/app/_components/siderbar/SideBar";
import { SidebarInset, SidebarProvider } from "@/app/_components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
