"use client";

import { createClient } from "@/app/_lib/supabase/client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../_components/ui/button";
import { Input } from "../_components/ui/input";
import Toast from "../_hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../_components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const FormSchema = z.object({
  email: z.string().email({ message: "E-mail inválido." }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
});

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsLoading(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        Toast({
          title: "Erro ao fazer login",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      if (data.user) {
        Toast({
          title: "Login realizado",
          description: "Bem vindo a Unienf",
        });
        router.push("/admin");
        router.refresh();
      }
    } catch (error) {
      console.error("Erro inesperado durante o login:", error);
      Toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao fazer login, tente novamente",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background flex min-h-screen">
      <div className="bg-primary relative hidden items-center justify-center overflow-hidden lg:flex lg:w-1/2">
        <div className="from-primary to-primary/80 absolute inset-0 bg-gradient-to-br"></div>
        <div className="bg-primary-foreground/10 absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 transform rounded-full blur-3xl"></div>
        <div className="bg-primary-foreground/10 absolute bottom-0 left-0 h-96 w-96 -translate-x-1/2 translate-y-1/2 transform rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <Link className="mb-5 flex items-center gap-3" href="/">
            <Image
              src="/logo-unienf-branca.png"
              alt="Logo da UNIENF"
              width={250}
              height={250}
            />
          </Link>
          <h1 className="text-primary-foreground mb-4 text-4xl font-bold">
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
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel htmlFor="email">E-mail</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel htmlFor="password">Senha</FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="h-11 w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="border-primary-foreground/30 border-t-primary-foreground h-4 w-4 animate-spin rounded-full border-2" />
                    Entrando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Entrar
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
