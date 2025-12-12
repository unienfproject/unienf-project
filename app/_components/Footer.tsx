import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer id="contato" className="bg-foreground text-card py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link className="mb-4 flex items-center gap-2" href="/">
              <Image
                src="/logo.jpg"
                alt="Logo da UNIENF"
                width={90}
                height={90}
              />
            </Link>
            <p className="text-card/70 mb-4 text-sm leading-relaxed">
              Formando profissionais de enfermagem qualificados e comprometidos
              com o cuidado humanizado há mais de 15 anos.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="#"
                className="bg-card/10 hover:bg-primary flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
              >
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
                  className="lucide lucide-facebook h-4 w-4"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </Link>
              <Link
                href="#"
                className="bg-card/10 hover:bg-primary flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
              >
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
                  className="lucide lucide-instagram h-4 w-4"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </Link>
              <Link
                href="#"
                className="bg-card/10 hover:bg-primary flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
              >
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
                  className="lucide lucide-linkedin h-4 w-4"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </Link>
              <Link
                href="#"
                className="bg-card/10 hover:bg-primary flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
              >
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
                  className="lucide lucide-youtube h-4 w-4"
                >
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                  <path d="m10 15 5-3-5-3z"></path>
                </svg>
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
                <Link
                  href="#cursos"
                  className="text-card/70 hover:text-primary text-sm transition-colors"
                >
                  Técnico em Enfermagem
                </Link>
              </li>
              <li>
                <Link
                  href="#cursos"
                  className="text-card/70 hover:text-primary text-sm transition-colors"
                >
                  Auxiliar de Enfermagem
                </Link>
              </li>
              <li>
                <Link
                  href="#cursos"
                  className="text-card/70 hover:text-primary text-sm transition-colors"
                >
                  Especialização em Urgência
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-semibold">Atendimento</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  className="text-card/70 hover:text-primary text-sm transition-colors"
                  href="/login/aluno"
                >
                  Área do Aluno
                </Link>
              </li>
              <li>
                <Link
                  className="text-card/70 hover:text-primary text-sm transition-colors"
                  href="/login/professor"
                >
                  Área do Professor
                </Link>
              </li>
              <li>
                <Link
                  className="text-card/70 hover:text-primary text-sm transition-colors"
                  href="/login/admin"
                >
                  Área Administrativa
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
    </footer>
  );
}
