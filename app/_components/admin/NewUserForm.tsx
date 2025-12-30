"use client";

import { Check, Eye, EyeOff, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Textarea } from "@/app/_components/ui/textarea";
import { cn } from "@/app/_lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";

import { createInternalUser } from "@/app/_lib/actions/users";

type Role = "recepção" | "coordenação" | "administrativo" | "professor";

export default function NewUserForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    cpf: "",
    telefone: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "" as Role | "",
    observation: "",
  });

  const passwordValidation = {
    hasUpperCase: /[A-Z]/.test(form.password),
    hasNumber: /[0-9]/.test(form.password),
  };

  const isPasswordValid =
    passwordValidation.hasUpperCase && passwordValidation.hasNumber;

  function onChange<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim()) return toast.error("Nome é obrigatório.");
    if (form.cpf.replace(/\D/g, "").length !== 11)
      return toast.error("CPF inválido.");
    if (!form.telefone.trim()) return toast.error("Telefone é obrigatório.");
    if (!form.email.includes("@")) return toast.error("E-mail inválido.");
    if (!form.role) return toast.error("Selecione a função (role).");

    if (form.password !== form.confirmPassword) {
      return toast.error("As senhas não coincidem.");
    }
    if (!isPasswordValid) {
      return toast.error("Senha não atende aos requisitos mínimos.");
    }

    startTransition(async () => {
      try {
        await createInternalUser({
          name: form.name,
          cpf: form.cpf,
          telefone: form.telefone,
          email: form.email,
          password: form.password,
          role: form.role as Role,
          observation: form.observation.trim() ? form.observation.trim() : null,
        });

        toast.success("Usuário criado com sucesso.");
        router.refresh();

        setForm({
          name: "",
          cpf: "",
          telefone: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "" as Role | "",
          observation: "",
        });
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Erro ao criar usuário.",
        );
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
        <Label className="block text-sm font-medium text-gray-700">
          Nome completo
        </Label>
        <Input
          type="text"
          value={form.name}
          onChange={(e) => onChange("name", e.target.value)}
          className="focus:border-primary focus:ring-primary mt-1 w-full rounded-lg border-gray-300"
          placeholder="Nome do Usuário"
        />
      </div>

      <div>
        <Label className="block text-sm font-medium text-gray-700">CPF</Label>
        <Input
          type="text"
          value={form.cpf}
          onChange={(e) => onChange("cpf", e.target.value)}
          className="focus:border-primary focus:ring-primary mt-1 w-full rounded-lg border-gray-300"
          placeholder="000.000.000-00"
        />
      </div>

      <div>
        <Label className="block text-sm font-medium text-gray-700">Email</Label>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => onChange("email", e.target.value)}
          className="focus:border-primary focus:ring-primary mt-1 w-full rounded-lg border-gray-300"
          placeholder="email@exemplo.com"
        />
      </div>

      <div>
        <Label className="block text-sm font-medium text-gray-700">
          Telefone
        </Label>
        <Input
          type="tel"
          value={form.telefone}
          onChange={(e) => onChange("telefone", e.target.value)}
          className="focus:border-primary focus:ring-primary mt-1 w-full rounded-lg border-gray-300"
          placeholder="(00) 00000-0000"
        />
      </div>

      <div>
        <Label className="block text-sm font-medium text-gray-700">Setor</Label>
        <Select value={form.role} onValueChange={(v) => onChange("role", v)}>
          <SelectTrigger className="focus:border-primary focus:ring-primary mt-1 w-full rounded-lg border-gray-300">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recepção">Recepção</SelectItem>
            <SelectItem value="coordenação">Coordenação</SelectItem>
            <SelectItem value="administrativo">Administrativo</SelectItem>
            <SelectItem value="professor">Professor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="block text-sm font-medium text-gray-700">Senha</Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => onChange("password", e.target.value)}
            placeholder="••••••••"
            required
            className="focus:border-primary focus:ring-primary mt-1 w-full rounded-lg border-gray-300 pr-10"
          />
          <Button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="hover:bg-primary absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 bg-white text-black hover:text-white"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>

        {form.password ? (
          <div className="mt-2 space-y-1 text-xs">
            <div
              className={cn(
                "flex items-center gap-2",
                passwordValidation.hasUpperCase
                  ? "text-green-600"
                  : "text-red-600",
              )}
            >
              {passwordValidation.hasUpperCase ? (
                <Check className="h-3 w-3" />
              ) : (
                <X className="h-3 w-3" />
              )}
              Pelo menos 1 letra maiúscula
            </div>
            <div
              className={cn(
                "flex items-center gap-2",
                passwordValidation.hasNumber
                  ? "text-green-600"
                  : "text-red-600",
              )}
            >
              {passwordValidation.hasNumber ? (
                <Check className="h-3 w-3" />
              ) : (
                <X className="h-3 w-3" />
              )}
              Pelo menos 1 número
            </div>
          </div>
        ) : null}
      </div>

      <div>
        <Label className="block text-sm font-medium text-gray-700">
          Confirmar senha
        </Label>
        <Input
          type="password"
          value={form.confirmPassword}
          onChange={(e) => onChange("confirmPassword", e.target.value)}
          className="focus:border-primary focus:ring-primary mt-1 w-full rounded-lg border-gray-300"
          placeholder="••••••••"
        />
      </div>

      <div className="md:col-span-2">
        <Label className="block text-sm font-medium text-gray-700">
          Observações
        </Label>
        <Textarea
          rows={4}
          value={form.observation}
          onChange={(e) => onChange("observation", e.target.value)}
          className="focus:border-primary focus:ring-primary mt-1 w-full rounded-lg border-gray-300"
          placeholder="Informações adicionais"
        />
      </div>

      <div className="flex justify-end md:col-span-2">
        <Button
          type="submit"
          disabled={pending}
          className="bg-primary rounded-lg px-6 py-2 text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </div>
    </form>
  );
}
