import Link from "next/link";
import Image from "next/image";

export default function Login() {
  return (
    <div className="bg-background flex min-h-screen">
      <div className="bg-primary relative hidden items-center justify-center overflow-hidden lg:flex lg:w-1/2">
        <div className="from-primary to-primary/80 absolute inset-0 bg-gradient-to-br"></div>
        <div className="bg-primary-foreground/10 absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 transform rounded-full blur-3xl"></div>
        <div className="bg-primary-foreground/10 absolute bottom-0 left-0 h-96 w-96 -translate-x-1/2 translate-y-1/2 transform rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <Link className="mb-5 flex items-center gap-3" href="/">
            <Image
              src="/logo.jpg"
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
      <div className="flex-1 flex flex-col justify-center px-6 lg:px-16">
        <div className="max-w-md w-full mx-auto"><a className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8" href="/">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-arrow-left w-4 h-4">
            <path d="m12 19-7-7 7-7"></path>
            <path d="M19 12H5"></path>
          </svg>
          Voltar para o site
        </a>
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-graduation-cap w-6 h-6 text-primary-foreground">
                <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path>
                <path d="M22 10v6"></path>
                <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>
              </svg>
            </div>
            <span className="text-xl font-bold text-foreground">UNIENF</span>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Área do Aluno</h2>
            <p className="text-muted-foreground">Digite suas credenciais para acessar o sistema</p>
          </div>
          <form className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">E-mail</label>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-mail absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground">
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                <input type="email" className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-11 h-12" id="email" placeholder="seu@email.com" required="" value="">
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">Senha</label>
                <a href="#" className="text-sm text-primary hover:underline">Esqueceu a senha?</a>
              </div>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-lock absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input type="password" className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-11 h-12" id="password" placeholder="••••••••" required="" value="">
              </div>
            </div>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md px-4 py-2 w-full h-12 text-base" type="submit">Entrar</button>
          </form>
          <div className="mt-8 text-center"><p className="text-sm text-muted-foreground">
            Precisa de ajuda?
            <a href="#" className="text-primary hover:underline">Entre em contato</a>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
}
