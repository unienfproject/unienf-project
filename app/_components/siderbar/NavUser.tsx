"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/app/_lib/supabase/client";
import { LogOut, MoreVertical, UserCircle, X } from "lucide-react";
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

export function NavUser({
  user,
}: {
  user: {
    name: string | null;
    email: string | null;
    avatar_url: string | null;
  };
}) {
  const { isMobile, setOpen } = useSidebar();
  const router = useRouter();
  const supabase = createClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [profile, setProfile] = useState<{
    name: string | null;
    email: string | null;
    telefone?: string | null;
    cpf?: string | null;
    avatar_url?: string | null;
  } | null>(null);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Erro ao fazer logout");
    } else {
      toast.success("Logout realizado com sucesso");
      isMobile && setOpen(false);
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

      const { data } = await supabase
        .from("profiles")
        .select("name, email, telefone, cpf, avatar_url")
        .eq("user_id", authUser.id)
        .single();

      setProfile(
        data ?? {
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
        },
      );
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
                  <span className="truncate text-xs">
                    {user.email || ""}
                  </span>
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
                    isMobile && setOpen(false);
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
                className="cursor-pointer"
              >
                <LogOut />
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
                  <AvatarImage
                    src={profile.avatar_url || undefined}
                  />
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
                  <p className="font-semibold text-lg">
                    {profile.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {profile.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Telefone</p>
                  <p>{profile.telefone || "—"}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">CPF</p>
                  <p>{profile.cpf || "—"}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
