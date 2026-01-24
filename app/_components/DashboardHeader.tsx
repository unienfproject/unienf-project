"use client";

import { PanelLeft } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { useSidebar } from "@/app/_components/ui/sidebar";

export function DashboardHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="flex h-14 items-center border-b px-4">
      <Button size="icon" variant="ghost" onClick={toggleSidebar}>
        <PanelLeft className="h-5 w-5" />
      </Button>
    </header>
  );
}
