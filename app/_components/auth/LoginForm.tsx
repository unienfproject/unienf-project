"use client";

import Toast from "@/app/_hooks/use-toast";
import { createClient } from "@/app/_lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { FieldSeparator } from "../ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const FormSchema = z.object({
  email: z.string().email({ message: "E-mail inválido." }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
});

export function LoginForm() {
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
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
        <div className="flex-end flex justify-end">
          <Link
            href="/resetpassword"
            className="text-muted-foreground hover:text-primary text-sm hover:underline"
          >
            Esqueceu sua senha?
          </Link>
        </div>
        <Button type="submit" className="mb-5 h-11 w-full" disabled={isLoading}>
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
      <FieldSeparator></FieldSeparator>
      <div className="text-muted-foreground mt-4 space-x-4 text-center text-xs">
        <Link href="/terms" className="hover:text-primary transition-colors">
          Termos
        </Link>
        <span>·</span>
        <Link href="/privacy" className="hover:text-primary transition-colors">
          Privacidade
        </Link>
      </div>
    </Form>
  );
}
