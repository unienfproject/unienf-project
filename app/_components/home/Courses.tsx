import CourseCard from "./CourseCard";

const courses = [
  {
    title: "Técnico em Enfermagem",
    description:
      "Formação completa para atuar em hospitais, clínicas, postos de saúde e atendimento domiciliar.",
    imageSrc: "/",
    imageAlt: "Técnico em Enfermagem",
    duration: "18 meses",
    modules: "12 módulos",
    features: [
      "Estágio supervisionado",
      "Material didático incluso",
      "Certificação reconhecida pelo MEC",
    ],
  },
  {
    title: "Auxiliar de Enfermagem",
    description:
      "Curso preparatório para quem deseja iniciar na área da saúde com uma formação rápida e prática.",
    imageSrc: "/",
    imageAlt: "Auxiliar de Enfermagem",
    duration: "12 meses",
    modules: "8 módulos",
    features: [
      "Aulas práticas desde o início",
      "Professores especializados",
      "Mercado em alta demanda",
    ],
  },
  {
    title: "Especialização em Urgência",
    description:
      "Para técnicos que desejam se especializar no atendimento de emergências e primeiros socorros.",
    imageSrc: "/",
    imageAlt: "Especialização em Urgência",
    duration: "6 meses",
    modules: "6 módulos",
    features: [
      "Simulações realísticas",
      "Certificação especializada",
      "Aulas aos finais de semana",
    ],
  },
];

export default function Courses() {
  return (
    <section id="cursos" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="text-primary text-sm font-semibold tracking-wider uppercase">
            Nossos cursos
          </span>
          <h2 className="text-foreground mt-3 mb-6 text-3xl font-bold md:text-4xl">
            Encontre o curso ideal para você
          </h2>
          <p className="text-muted-foreground text-lg">
            Oferecemos formações completas e especializações para você se
            destacar no mercado de trabalho da área da saúde.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {courses.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </div>
      </div>
    </section>
  );
}
