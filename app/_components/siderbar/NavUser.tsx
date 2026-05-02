"use client";

import { useEffect, useState } from "react";
import { getMyAccountProfile } from "@/app/_lib/actions/me";
import { createClient } from "@/app/_lib/supabase/client";
import { LogOut, MoreVertical, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/app/_components/ui/sidebar";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";

type NavUserProfile = {
  name: string | null;
  email: string | null;
  telefone?: string | null;
  cpf?: string | null;
  avatar_url?: string | null;
  role?: string | null;
};

function getRoleLabel(role?: string | null) {
  const normalized = (role ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const labels: Record<string, string> = {
    administrativo: "Administrativo",
    professor: "Professor",
    aluno: "Aluno",
    recepcao: "Recepção",
    coordenacao: "Coordenação",
  };

  if (!normalized) return "Não informado";
  return labels[normalized] ?? role ?? "Não informado";
}

export function NavUser({
  user,
}: {
  user: {
    name: string | null;
    email: string | null;
    telefone?: string | null;
    cpf?: string | null;
    role?: string | null;
    avatar_url: string | null;
  };
}) {
  const { isMobile, setOpen } = useSidebar();
  const router = useRouter();
  const supabase = createClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [profile, setProfile] = useState<NavUserProfile | null>(null);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Erro ao fazer logout");
    } else {
      toast.success("Logout realizado com sucesso");
      if (isMobile) setOpen(false);
      router.push("/login");
      router.refresh();
    }
  };

  useEffect(() => {
    if (!modalOpen) return;

    const loadProfile = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) return;

      try {
        const account = await getMyAccountProfile();

        setProfile({
          name: account.name,
          email: account.email,
          telefone: account.telefone,
          cpf: account.cpf,
          avatar_url: account.avatarUrl,
          role: account.role,
        });
      } catch {
        setProfile({
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
          telefone: user.telefone ?? null,
          cpf: user.cpf ?? null,
          role: user.role ?? null,
        });
      }
    };

    loadProfile();
  }, [modalOpen, supabase, user]);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="lg">
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage
                    src={user.avatar_url || undefined}
                    alt={user.name || ""}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2) || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user.name || "Usuário"}
                  </span>
                  <span className="truncate text-xs">{user.email || ""}</span>
                </div>

                <MoreVertical className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="font-normal">
                {user.name}
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    setModalOpen(true);
                    if (isMobile) setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <UserCircle />
                  Conta
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleSignOut}
                variant="destructive"
                className="cursor-pointer hover:bg-red-500"
              >
                <LogOut className="cursor-pointer hover:bg-red-500" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Minha Conta</DialogTitle>
          </DialogHeader>

          {profile && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 rounded-lg">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback className="rounded-lg text-lg">
                    {profile.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="text-lg font-semibold">{profile.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {profile.email}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {getRoleLabel(profile.role)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-muted-foreground">Telefone</p>
                  <p>{profile.telefone || "-"}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">CPF</p>
                  <p>{profile.cpf || "-"}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Função</p>
                  <p>{getRoleLabel(profile.role)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
