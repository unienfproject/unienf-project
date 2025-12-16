"use client";

import { Button } from "@/app/_components/ui/button";
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function VerifyEmail() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="animate-fade-in w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <div className="mb-4 inline-flex items-center gap-2">
            <Image
              src="/logo-unienf-vf.png"
              alt="Logo"
              width={100}
              height={100}
            />
          </div>
          <h2 className="font-display text-2xl font-semibold">
            Matrícula realizada com sucesso!
          </h2>
          <p className="text-muted-foreground">
            Enviamos um link para confirmação da conta por e-mail.
          </p>
        </div>

        <div className="glass-card space-y-6 rounded-lg text-center">
          <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <Mail className="text-primary h-8 w-8" />
          </div>

          <div className="space-y-2">
            <p className="text-muted-foreground">
              Clique no link enviado por e-mail para ativação da conta.
            </p>
            <p className="text-muted-foreground text-sm">
              Senha enviada por e-mail!
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <Button asChild className="w-full">
              <Link href="/login">Retornar</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
