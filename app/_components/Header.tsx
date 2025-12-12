import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-card/95 border-border/50 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-md">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          <Link className="group flex items-center gap-2" href="/">
            <Image
              src="/logo.jpg"
              alt="Logo da UNIENF"
              width={90}
              height={90}
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-menu text-foreground h-6 w-6"
            >
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
}
