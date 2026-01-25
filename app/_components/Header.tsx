"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-card/95 border-border/50 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-md">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-14 items-center justify-between py-4 lg:h-16">
          <Link className="group flex items-center gap-2" href="/">
            <Image
              src="/logo-unienf-vf.png"
              alt="Logo da UNIENF"
              width={100}
              height={100}
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
          <Button
            className="bg-white cursor-pointer rounded-lg p-2 transition-colors lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className="text-foreground h-6 w-6" />
          </Button>

        </div>
      </div>
      {menuOpen && (
        <div className="lg:hidden bg-card border-b border-border px-4 py-6">
          <nav className="flex flex-col gap-4">
            <Link
              href="#home"
              className="text-muted-foreground hover:text-primary text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              href="#sobre"
              className="text-muted-foreground hover:text-primary text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Sobre
            </Link>

            <Link
              href="#cursos"
              className="text-muted-foreground hover:text-primary text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Cursos
            </Link>

            <Link
              href="#localizacao"
              className="text-muted-foreground hover:text-primary text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Localização
            </Link>

            <Link
              href="#contato"
              className="text-muted-foreground hover:text-primary text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Contato
            </Link>

            <Button asChild className="mt-2">
              <Link href="/login">Login</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
