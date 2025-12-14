import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Bell, Search } from "lucide-react";
import SideBar from "../SideBar";

export default function Alunos() {
  return (
    <main>
      <SideBar />
      <div className="ml-64 flex-1">
        <header className="bg-card border-border flex h-16 items-center justify-between border-b px-6">
          <div className="max-w-md flex-1">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                type="text"
                className="border-input ring-offset-background file:text-foreground placeholder:text-muted-foreground bg-muted/50 focus-visible:ring-primary flex h-10 w-full rounded-md border-0 px-3 py-2 pl-10 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                placeholder="Buscar..."
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground relative inline-flex h-10 w-10 items-center justify-center gap-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
              <Bell className="text-muted-foreground h-5 w-5" />
              <span className="bg-destructive absolute top-1 right-1 h-2 w-2 rounded-full"></span>
            </Button>
            <div className="border-border flex items-center gap-3 border-l pl-4">
              <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-full">
                <span className="text-primary-foreground text-sm font-semibold">
                  A
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-foreground text-sm font-medium">
                  Administrador
                </p>
                <p className="text-muted-foreground text-xs">Administrador</p>
              </div>
            </div>
          </div>
        </header>
      </div>
    </main>
  );
}
