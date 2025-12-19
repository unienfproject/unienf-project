import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import LogoParks from "./LogoParks";

export default function Footer() {
  return (
    <footer
      id="contato"
      className="bg-foreground text-card flex flex-col items-center justify-center gap-4 py-16"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link className="mb-4 flex items-center gap-2" href="/">
              <Image
                src="/logo-unienf-vf.png"
                alt="Logo da UNIENF"
                width={120}
                height={120}
              />
            </Link>
            <p className="text-card/70 mb-4 text-sm leading-relaxed">
              Formando profissionais de enfermagem qualificados e comprometidos
              com o cuidado humanizado há mais de 20 anos.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="https://www.facebook.com/unienflagos/?locale=pt_BR"
                target="_blank"
                className="bg-card/10 hover:bg-primary flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="https://www.instagram.com/unienflagos/?hl=pt"
                target="_blank"
                className="bg-card/10 hover:bg-primary flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-semibold">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#home"
                  className="text-card/70 hover:text-primary text-sm transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#sobre"
                  className="text-card/70 hover:text-primary text-sm transition-colors"
                >
                  Sobre
                </Link>
              </li>
              <li>
                <Link
                  href="#cursos"
                  className="text-card/70 hover:text-primary text-sm transition-colors"
                >
                  Cursos
                </Link>
              </li>
              <li>
                <Link
                  href="#localizacao"
                  className="text-card/70 hover:text-primary text-sm transition-colors"
                >
                  Localização
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-semibold">Nossos Cursos</h4>
            <ul className="space-y-2">
              <li>
                  Técnico em Enfermagem
              </li>
              <li>
                  Especializações
              </li>
              <li>
                  Aulas de Campo
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-semibold">Atendimento</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  className="text-card/70 hover:text-primary text-sm transition-colors"
                  href="https://wa.me/5511987654321" target="_blank"
                >
                  Dúvidas Cursos
                </Link>
              </li>
              <li>
                <Link
                  className="text-card/70 hover:text-primary text-sm transition-colors"
                  href="https://wa.me/5511987654321" target="_blank"
                >
                  Dúvidas Matrícula
                </Link>
              </li>
              <li>
                <Link
                  className="text-card/70 hover:text-primary text-sm transition-colors"
                 href="https://wa.me/5511987654321" target="_blank"
                >
                  Suporte Aluno
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-card/10 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-card/50 text-sm">
              © 2025 UNIENF. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="text-card/50 hover:text-primary text-sm transition-colors"
              >
                Política de Privacidade
              </Link>
              <Link
                href="#"
                className="text-card/50 hover:text-primary text-sm transition-colors"
              >
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <p className="text-white">Desenvolvido por</p>
        <Link href="https://parkscompany.com.br" target="_blank">
          <LogoParks />
        </Link>
      </div>
    </footer>
  );
}
