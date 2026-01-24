"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/app/_components/ui/sidebar";

import { getUserProfile, type Profile } from "@/app/_lib/actions/profile";
import {
  Bell,
  ClipboardList,
  FileText,
  FolderOpen,
  GraduationCap,
  LayoutDashboard,
  Users,
  WalletCards,
  X,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/app/_components/ui/button";

import { NavMain } from "./NavMain";
import { NavUser } from "./NavUser";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { setOpen, isMobile } = useSidebar();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await getUserProfile();
        setProfile(profileData);
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const adminMenuItems = [
    { title: "Visão Geral", url: "/admin", icon: LayoutDashboard },
    { title: "Alunos", url: "/admin/alunos", icon: Users },
    { title: "Professores", url: "/admin/professores", icon: GraduationCap },
    { title: "Usuários", url: "/admin/users", icon: Users },
    { title: "Turmas", url: "/admin/turmas", icon: FolderOpen },
    { title: "Cursos", url: "/admin/cursos", icon: GraduationCap },
    { title: "Financeiro", url: "/admin/financeiro", icon: WalletCards },
    { title: "Avisos", url: "/admin/avisos", icon: Bell },
  ];

  const coordenacaoMenuItems = [
    { title: "Visão Geral", url: "/admin", icon: LayoutDashboard },
    { title: "Alunos", url: "/admin/alunos", icon: Users },
    { title: "Professores", url: "/admin/professores", icon: GraduationCap },
    { title: "Turmas", url: "/admin/turmas", icon: FolderOpen },
    { title: "Cursos", url: "/admin/cursos", icon: GraduationCap },
    { title: "Avisos", url: "/admin/avisos", icon: Bell },
  ];

  const alunoMenuItems = [
    { title: "Visão Geral", url: "/aluno", icon: LayoutDashboard },
    { title: "Meus Documentos", url: "/aluno/documentos", icon: FileText },
    { title: "Minhas Notas", url: "/aluno/notas", icon: ClipboardList },
    { title: "Financeiro", url: "/aluno/financeiro", icon: WalletCards },
    { title: "Avisos", url: "/aluno/avisos", icon: Bell },
  ];

  const professorMenuItems = [
    { title: "Visão Geral", url: "/professores", icon: LayoutDashboard },
    { title: "Minhas Turmas", url: "/professores/turmas", icon: FolderOpen },
    { title: "Lançar Notas", url: "/professores/notas", icon: ClipboardList },
    { title: "Avisos", url: "/professores/avisos", icon: Bell },
  ];

  const recepcaoMenuItems = [
    { title: "Visão Geral", url: "/recepcao", icon: LayoutDashboard },
    { title: "Alunos", url: "/recepcao/alunos", icon: Users },
    { title: "Documentos", url: "/recepcao/documentos", icon: FileText },
    { title: "Financeiro", url: "/recepcao/financeiro", icon: WalletCards },
    { title: "Avisos", url: "/recepcao/avisos", icon: Bell },
  ];

  const renderMenu = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-4">
          <div className="text-muted-foreground text-sm">Carregando...</div>
        </div>
      );
    }

    const role = profile?.role;

    const closeOnMobile = () => isMobile && setOpen(false);

    if (role === "administrativo") {
      return <NavMain items={adminMenuItems} onNavigate={closeOnMobile} />;
    }

    if (role === "coordenação") {
      return <NavMain items={coordenacaoMenuItems} onNavigate={closeOnMobile} />;
    }

    if (role === "aluno") {
      return <NavMain items={alunoMenuItems} onNavigate={closeOnMobile} />;
    }

    if (role === "professor") {
      return <NavMain items={professorMenuItems} onNavigate={closeOnMobile} />;
    }

    if (role === "recepção") {
      return <NavMain items={recepcaoMenuItems} onNavigate={closeOnMobile} />;
    }

    return (
      <div className="flex flex-col gap-2 p-4 text-sm text-muted-foreground">
        Role não definida.
      </div>
    );
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="bg-primary relative flex items-center px-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Image
                  src="/logo-unienf-vf.png"
                  alt="UNIENF"
                  width={50}
                  height={50}
                />
                <span className="text-base font-semibold">UNIENF</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>


      <SidebarContent className="bg-primary">
        {renderMenu()}
      </SidebarContent>

      <SidebarFooter className="bg-primary">
        {profile && (
          <NavUser
            user={{
              name: profile.name,
              email: profile.email,
              avatar_url: profile.avatar_url,
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
