"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "../_components/auth/LoginForm";

export default function Login() {
  return (
    <div className="bg-background flex min-h-screen">
      <div className="bg-primary relative hidden items-center justify-center overflow-hidden lg:flex lg:w-1/2">
        <div className="relative z-10 flex flex-col justify-center gap-4 px-16">
          <Link className="flex items-center gap-3" href="/">
            <Image
              src="/logo-unienf-branca.png"
              alt="Logo da UNIENF"
              width={250}
              height={250}
            />
          </Link>
          <h1 className="text-primary-foreground text-4xl font-bold">
            Bem-vindo de volta!
          </h1>
          <p className="text-primary-foreground/80 max-w-md text-lg">
            Acesse sua conta para continuar sua jornada de aprendizado e fazer a
            diferença na área da saúde.
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center px-6 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <Link
            className="text-muted-foreground hover:text-primary mb-8 inline-flex items-center gap-2 text-sm transition-colors"
            href="/"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o site
          </Link>
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="text-foreground text-xl font-bold">UNIENF</span>
          </div>
          <div className="mb-8">
            <h2 className="text-foreground mb-2 text-2xl font-bold">
              Área do Usuário
            </h2>
            <p className="text-muted-foreground">
              Digite suas credenciais para acessar o sistema da UNIENF
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
