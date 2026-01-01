"use client";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/app/_components/ui/field";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { cn } from "@/app/_lib/utils";
import { useRouter } from "next/navigation";
import { ComponentProps, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/app/_lib/supabase/client";
import Link from "next/link";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { Label } from "@/app/_components/ui/label";

export function SignupForm({ className, ...props }: ComponentProps<"form">) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    etiqueta: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const passwordValidation = {
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
  };

  const isPasswordValid =
    passwordValidation.hasUpperCase && passwordValidation.hasNumber;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (!isPasswordValid) {
      toast.error("Senha não atende aos requisitos mínimos");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
        },
      });

      if (error) {
        toast.error(error.message || "Erro ao criar conta");
        setIsLoading(false);
        return;
      }

      if (data.user) {
        toast.success("Conta criada com sucesso! Verifique seu email.");
        router.push("/verify-email");
      }
    } catch {
      toast.error("Erro inesperado ao criar conta");
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Nova Matrícula</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Matrícula de um novo aluno.
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Nome Completo</FieldLabel>
          <Input
            id="name"
            type="text"
            className="focus-neon shadow-accent/15 rounded-lg pr-10 shadow-lg"
            placeholder="Nome Completo"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            className="focus-neon shadow-accent/15 rounded-lg pr-10 shadow-lg"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="etiqueta">Etiqueta</FieldLabel>
          <Input
            id="etiqueta"
            type="etiqueta"
            placeholder="Etiqueta Turma"
            className="focus-neon shadow-accent/15 rounded-lg pr-10 shadow-lg"
            value={formData.etiqueta}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Senha</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
              required
              className="focus-neon shadow-accent/15 rounded-lg pr-10 shadow-lg"
            />
            <Button
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {formData.password && (
            <div className="mt-2 space-y-1 text-xs">
              <div className={cn("flex items-center gap-2")}></div>
              <div
                className={cn(
                  "flex items-center gap-2",
                  passwordValidation.hasUpperCase
                    ? "text-green-500"
                    : "text-red-500",
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
                    ? "text-green-500"
                    : "text-red-500",
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
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirme a Senha</FieldLabel>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
              className="focus-neon shadow-accent/15 rounded-lg pr-10 shadow-lg"
            />
            <Button
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
              aria-label={
                showConfirmPassword ? "Ocultar senha" : "Mostrar senha"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </Field>
        <Field>
          <div className="flex items-start space-x-2 pt-2">
            <Checkbox
              id="terms"
              className="border-accent cursor-pointer"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, acceptTerms: checked as boolean })
              }
            />
            <div className="text-muted-foreground">
              <Label
                htmlFor="terms"
                className="text-muted-foreground flex cursor-pointer flex-wrap gap-1 text-sm"
              >
                Li e aceito os{" "}
                <Link
                  href="/terms"
                  className="text-primary hover:text-primary/50 transition-colors hover:underline"
                >
                  Termos de Uso
                </Link>{" "}
                e a{" "}
                <Link
                  href="/privacy"
                  className="text-primary hover:text-primary/50 transition-colors hover:underline"
                >
                  Política de Privacidade
                </Link>
              </Label>
            </div>
          </div>
        </Field>
        <Field>
          <Button type="submit" disabled={isLoading || !formData.acceptTerms}>
            {isLoading ? "Criando conta..." : "Cadastrar Aluno"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}

