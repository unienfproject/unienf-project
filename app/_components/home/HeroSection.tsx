import { ArrowRight, Award, Heart, Users } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="flex min-h-screen items-center overflow-hidden"
    >
      <div className="from-primary/5 via-background to-background absolute inset-0 bg-linear-to-b"></div>

      <div className="bg-primary/10 absolute top-20 right-0 h-[600px] w-[600px] rounded-full blur-3xl"></div>

      <div className="bg-accent/10 absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-4 lg:px-8">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
          <div className="animate-slide-up flex-1 text-center lg:text-left">
            <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
              <Heart className="h-4 w-4" />
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
              <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 text-primary-foreground inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#25d366] px-4 py-2 text-base font-semibold whitespace-nowrap shadow-lg transition-all duration-200 hover:bg-[#25d366] hover:shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                <Link
                  href="https://wa.me/5511987654321"
                  target="_blank"
                  className="text-primary-foreground"
                >
                  Whatsapp
                </Link>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
            <div className="mt-12 flex items-center justify-center gap-8 lg:justify-start">
              <div className="text-center">
                <div className="text-primary mb-1 flex items-center justify-center gap-2">
                  <Users className="h-5 w-5" />
                  <span className="text-2xl font-bold">500+</span>
                </div>
                <p className="text-muted-foreground text-sm">Alunos formados</p>
              </div>

              <div className="bg-border h-12 w-px"></div>

              <div className="text-center">
                <div className="text-primary mb-1 flex items-center justify-center gap-2">
                  <Award className="h-5 w-5" />
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
                  src="/img-hero-section.jpg"
                  alt="Profissional de enfermagem cuidando de paciente"
                  width={500}
                  height={500}
                  quality={95}
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
