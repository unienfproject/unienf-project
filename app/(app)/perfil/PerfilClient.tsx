"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { MyAccountProfile } from "@/app/_lib/actions/me";
import { updateMyAccountProfile } from "@/app/_lib/actions/me";
import { changeMyPassword } from "@/app/_lib/actions/audit";

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";

export default function PerfilClient({ me }: { me: MyAccountProfile }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(me.name ?? "");
  const [telefone, setTelefone] = useState(me.telefone ?? "");
  const [email, setEmail] = useState(me.email ?? "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const initials = useMemo(() => {
    const base = (me.name || me.email || "U").trim();
    const parts = base.split(" ").filter(Boolean);
    return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
  }, [me.name, me.email]);

  function handleSaveProfile() {
    startTransition(async () => {
      await updateMyAccountProfile({ name, telefone });
      router.refresh();
    });
  }

  function handleChangePassword() {
    startTransition(async () => {
      if (newPassword !== newPassword2) throw new Error("As senhas não conferem.");
      await changeMyPassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setNewPassword2("");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground">Dados da conta em uso.</p>
      </div>

      <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
              {me.avatarUrl ? (
                <img src={me.avatarUrl} alt="Avatar" className="h-16 w-16 rounded-full object-cover" />
              ) : (
                <span className="text-primary text-xl font-semibold">{initials}</span>
              )}
            </div>

            <div>
              <p className="text-foreground font-semibold">{me.name ?? "Sem nome"}</p>
              <p className="text-muted-foreground text-sm">{me.email ?? "-"}</p>
              <p className="text-muted-foreground text-sm">{me.role}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-6">
        <h2 className="text-foreground mb-4 text-lg font-semibold">Dados pessoais</h2>

        <div className="flex flex-col gap-3 w-[50%]">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Telefone</Label>
            <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>E-mail</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={handleSaveProfile} disabled={isPending}>
            Salvar
          </Button>
        </div>
      </div>

      <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-6">
        <h2 className="text-foreground mb-4 text-lg font-semibold">Alterar senha</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Senha atual</Label>
            <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Nova senha</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Confirmar nova senha</Label>
            <Input type="password" value={newPassword2} onChange={(e) => setNewPassword2(e.target.value)} />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={handleChangePassword} disabled={isPending}>
            Atualizar senha
          </Button>
        </div>
      </div>
    </div>
  );
}
