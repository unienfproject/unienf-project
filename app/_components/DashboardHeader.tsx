"use client";

import { PanelLeft } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { useSidebar } from "@/app/_components/ui/sidebar";

export function DashboardHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="flex h-14 shrink-0 items-center border-b px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl items-center">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={toggleSidebar}
        aria-label="Abrir menu"
      >
        <PanelLeft className="h-5 w-5" />
      </Button>
      </div>
    </header>
  );
}
