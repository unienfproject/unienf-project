import {
  Bell,
  ClipboardList,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";
import Link from "next/link";

export default function SideBar() {
  return (
    <aside className="bg-sidebar fixed top-0 bottom-0 left-0 z-40 flex w-64 flex-col">
      <div className="border-sidebar-border border-b p-6">
        <Link className="flex items-center gap-3" href="/">
          <div className="bg-sidebar-primary flex h-10 w-10 items-center justify-center rounded-xl">
            <GraduationCap className="text-sidebar-primary-foreground h-6 w-6" />
          </div>
          <span className="text-sidebar-foreground text-xl font-bold">
            UNIENF
          </span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        <Link
          className="bg-sidebar-primary text-sidebar-primary-foreground shadow-soft flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
          href="/aluno"
        >
          <LayoutDashboard className="h-5 w-5" />
          Visão Geral
        </Link>
        <Link
          className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
          href="/aluno/documentos"
        >
          <FileText className="h-5 w-5" />
          Meus Documentos
        </Link>
        <Link
          className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
          href="/aluno/notas"
        >
          <ClipboardList className="h-5 w-5" />
          Minhas Notas
        </Link>
        <Link
          className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
          href="/aluno/avisos"
        >
          <Bell className="h-5 w-5" />
          Avisos
        </Link>
      </nav>
      <div className="border-sidebar-border space-y-1 border-t p-4">
        <Link
          className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
          href="/aluno/perfil"
        >
          <User className="h-5 w-5" />
          Perfil
        </Link>
        <Link
          className="text-sidebar-foreground/80 hover:bg-destructive hover:text-destructive-foreground flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
          href="/"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </Link>
      </div>
    </aside>
  );
}
