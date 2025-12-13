import Image from "next/image";
import { Button } from "../ui/button";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-20"
    >
      <div className="from-primary/5 via-background to-background absolute inset-0 bg-gradient-to-b"></div>

      <div className="bg-primary/10 absolute top-20 right-0 h-[600px] w-[600px] rounded-full blur-3xl"></div>

      <div className="bg-accent/10 absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-4 lg:px-8">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
          <div className="animate-slide-up flex-1 text-center lg:text-left">
            <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
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
                className="lucide lucide-heart h-4 w-4"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
              Formação de qualidade em enfermagem
            </div>
            <h1 className="text-foreground mb-6 text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
              Formação em
              <span className="gradient-text"> Enfermagem </span>
              de Excelência
            </h1>
            <p className="text-muted-foreground mx-auto mb-8 max-w-xl text-lg md:text-xl lg:mx-0">
              A UNIENF prepara profissionais para transformar vidas. Junte-se a
              nós e faça a diferença na área da saúde.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-base font-semibold whitespace-nowrap shadow-lg transition-all duration-200 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                Quero saber mais {/*Alterar para botão do whatsapp */}
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
                  className="lucide lucide-arrow-right h-5 w-5"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Button>
              <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border-primary text-primary hover:bg-primary hover:text-primary-foreground inline-flex h-10 items-center justify-center gap-2 rounded-lg border-2 bg-transparent px-4 py-2 text-base font-semibold whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                Ver cursos
              </Button>
            </div>
            <div className="mt-12 flex items-center justify-center gap-8 lg:justify-start">
              <div className="text-center">
                <div className="text-primary mb-1 flex items-center justify-center gap-2">
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
                    className="lucide lucide-users h-5 w-5"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <span className="text-2xl font-bold">500+</span>
                </div>
                <p className="text-muted-foreground text-sm">Alunos formados</p>
              </div>

              <div className="bg-border h-12 w-px"></div>

              <div className="text-center">
                <div className="text-primary mb-1 flex items-center justify-center gap-2">
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
                    className="lucide lucide-award h-5 w-5"
                  >
                    <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                    <circle cx="12" cy="8" r="6"></circle>
                  </svg>
                  <span className="text-2xl font-bold">98%</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  Taxa de aprovação
                </p>
              </div>
            </div>
          </div>
          <div className="animate-fade-in relative flex-1">
            <div className="relative">
              <div className="from-primary/20 to-accent/20 absolute -inset-4 rounded-3xl bg-gradient-to-r blur-2xl"></div>

              <div className="bg-card shadow-large border-border/50 relative overflow-hidden rounded-3xl border">
                <Image
                  src="/"
                  alt="Profissional de enfermagem cuidando de paciente"
                  width={50}
                  height={50}
                  className="h-[400px] w-full object-cover lg:h-[500px]"
                />
                <div className="from-foreground/80 absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent p-6">
                  <p className="text-card text-lg font-medium">
                    Cuidar é a essência da enfermagem
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
