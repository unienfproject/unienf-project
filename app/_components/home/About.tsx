import { BookOpen, FlaskConical, Trophy, Users } from "lucide-react";
import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: FlaskConical,
    title: "Laboratórios Modernos",
    description:
      "Infraestrutura completa com equipamentos de última geração para prática supervisionada.",
  },
  {
    icon: BookOpen,
    title: "Professores Experientes",
    description:
      "Corpo docente formado por profissionais atuantes no mercado com ampla experiência.",
  },
  {
    icon: Trophy,
    title: "Alta Taxa de Aprovação",
    description:
      "Mais de 98% dos nossos alunos são aprovados em processos seletivos da área.",
  },
  {
    icon: Users,
    title: "Estágio Garantido",
    description:
      "Parcerias com hospitais e clínicas para garantir experiência prática aos alunos.",
  },
];

export default function About() {
  return (
    <section id="sobre" className="bg-muted/30 py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="animate-slide-up mx-auto mb-16 max-w-3xl text-center">
          <span className="text-primary text-sm font-semibold tracking-wider uppercase">
            Sobre nós
          </span>
          <h2 className="text-foreground mt-3 mb-6 text-3xl font-bold md:text-4xl">
            Por que escolher a UNIENF?
          </h2>
          <p className="text-muted-foreground text-lg">
            Há mais de 20 anos formando profissionais de enfermagem qualificados
            e comprometidos com o cuidado humanizado. Nossa missão é transformar
            vidas através da educação de excelência.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
