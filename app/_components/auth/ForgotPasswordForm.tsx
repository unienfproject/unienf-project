"use client";

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import Toast from "@/app/_hooks/use-toast";
import { createClient } from "@/app/_lib/supabase/client";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        Toast({
          title: "Erro ao enviar email",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      setEmailSent(true);
      Toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    } catch {
      Toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao enviar o email. Tente novamente.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="bg-background flex flex-1 items-center justify-center p-8">
        <div className="flex w-full max-w-md flex-col gap-8">
          <div className="flex flex-col gap-2 text-center">
            <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
              <Mail className="text-primary h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Email enviado!
            </h2>
            <p className="text-muted-foreground">
              Enviamos um link de redefinição de senha para{" "}
              <span className="font-semibold">{email}</span>. Verifique sua
              caixa de entrada e siga as instruções.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild variant="outline" className="h-11 w-full">
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para o login
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background flex flex-1 items-center justify-center p-8">
      <div className="flex w-full max-w-md flex-col gap-8">
        <div className="flex flex-col gap-2 text-center lg:text-left">
          <h2 className="text-2xl font-bold tracking-tight">
            Esqueci minha senha
          </h2>
          <p className="text-muted-foreground">
            Digite seu email e enviaremos um link para redefinir sua senha
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              className="h-11"
              required
            />
          </div>

          <Button type="submit" className="h-11 w-full" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="border-primary-foreground/30 border-t-primary-foreground h-4 w-4 animate-spin rounded-full border-2" />
                Enviando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Enviar link de redefinição
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </Button>
        </form>

        <p className="text-muted-foreground text-center text-sm">
          Lembrou sua senha?{" "}
          <Link
            href="/login"
            className="text-primary cursor-pointer hover:underline"
          >
            Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  );
}
