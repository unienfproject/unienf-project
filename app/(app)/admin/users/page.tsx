'use client'

import { Bell, Check, Eye, EyeOff, Search, X } from "lucide-react"
import { Button } from "../../../_components/ui/button"
import { Input } from "../../../_components/ui/input"
import { Label } from "../../../_components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../_components/ui/select"
import { Textarea } from "../../../_components/ui/textarea"
import { cn } from "@/app/_lib/utils"
import { toast } from "sonner"
import { createClient } from "@/app/_lib/supabase/client"
import { ComponentProps, useState } from "react"
import { useRouter } from "next/navigation"

//Essa página será a página de cadastro de novos usuáriois, como coordenação, recepção, administrativo, caso tenha.
//A ideia é ter um botão, dentro apenas do setor administrativo, em que abrirá essa página, para um cadastro interno de usuários.
//Aqui deve conter o salvamento dos dados e da Role no banco de dados, para que o usuário depois consiga acessar etc.
//A parte de observações, a ideia é que salve também no perfil do funcionário para visualização posterior da coordenação ou administração.
//Criação de senha será realizada no ato do cadastro do usuário.
//Verificar página posteriomente, pois não estou com acesso ao Supabase.

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
    acceptTerms: false, // Adicionado o campo acceptTerms
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
      <div>
        <header className="bg-card border-border flex h-16 items-center justify-between border-b px-6">
        <div className="max-w-md flex-1">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              type="text"
              className="border-input ring-offset-background file:text-foreground placeholder:text-muted-foreground bg-muted/50 focus-visible:ring-primary flex h-10 w-full rounded-md border-0 px-3 py-2 pl-10 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              placeholder="Buscar..."
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground relative inline-flex h-10 w-10 items-center justify-center gap-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
            <Bell className="text-muted-foreground h-5 w-5" />
          </Button>
          <div className="border-border flex items-center gap-3 border-l pl-4">
            <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-full">
              <span className="text-primary-foreground text-sm font-semibold">
                A
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-foreground text-sm font-medium">
                Administrador
              </p>
              <p className="text-muted-foreground text-xs">Administrador</p>
            </div>
          </div>
        </div>
      </header>
        <div className="max-w-4xl mx-auto p-4 gap-4">  
          <h1 className="text-2xl font-semibold text-primary mb-6">
            Cadastro de Funcionários
          </h1>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="block text-sm font-medium text-gray-700">
                  Nome completo
                </Label>
                <Input
                  type="text"
                  className="mt-1 w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
                  placeholder="Nome do funcionário"
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">
                  CPF
                </Label>
                <Input
                  type="text"
                  className="mt-1 w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
                  placeholder="000.000.000-00"
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  type="email"
                  className="mt-1 w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
              <Label htmlFor="password">Senha</Label>
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
        </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">
                  Telefone
                </Label>
                <Input
                  type="tel"
                  className="mt-1 w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">
                  Setor {/*(Role)*/}
                </Label>
                <Select>
                  <SelectTrigger className="mt-1 w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Recepção">Recepção</SelectItem>
                    <SelectItem value="Coordenação">Coordenação</SelectItem>
                    <SelectItem value="Administrativo">Administrativo</SelectItem>
                    <SelectItem value="Professor">Professor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label className="block text-sm font-medium text-gray-700">
                  Observações
                </Label>
                <Textarea
                  rows={4}
                  className="mt-1 w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
                  placeholder="Informações adicionais"
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
                >
                  Cadastrar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
  )
}
