import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="bg-card/95 border-border/50 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-md">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between py-4 lg:h-28">
          <Link className="group flex items-center gap-2" href="/">
            <Image
              src="/logo-unienf-vf.png"
              alt="Logo da UNIENF"
              width={120}
              height={120}
            />
          </Link>
          <nav className="hidden items-center gap-8 lg:flex">
            <Link
              href="#home"
              className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              href="#sobre"
              className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors duration-200"
            >
              Sobre
            </Link>
            <Link
              href="#cursos"
              className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors duration-200"
            >
              Cursos
            </Link>
            <Link
              href="#localizacao"
              className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors duration-200"
            >
              Localização
            </Link>
            <Link
              href="#contato"
              className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors duration-200"
            >
              Contato
            </Link>
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
          <Button className="hover:bg-muted cursor-pointer rounded-lg p-2 transition-colors lg:hidden">
            <Menu className="text-foreground h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
