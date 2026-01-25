"use client";

import ProtectedRoute from "@/app/_components/auth/ProtectedRoute";
import { AppSidebar } from "@/app/_components/siderbar/SideBar";
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "@/app/_components/ui/sidebar";
import { DashboardHeader } from "@/app/_components/DashboardHeader";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isMobile, setOpen } = useSidebar();

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [pathname, isMobile, setOpen]);

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />

      <div className="flex flex-1 flex-col">
        <DashboardHeader />
        <SidebarInset>{children}</SidebarInset>
      </div>
    </div>
  );
}

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SidebarProvider
        defaultOpen
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <LayoutContent>{children}</LayoutContent>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
