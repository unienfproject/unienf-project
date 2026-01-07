"use client";

import { useMemo, useState } from "react";
import CourseCard from "./CourseCard";
import { Button } from "@/app/_components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const courses = [
  {
    title: "Curso APH: Urgência e Emergência",
    description: "Qualificação em APH, Urgência e Emergência.",
    imageSrc: "/APH.jpg",
    imageAlt: "Curso APH",
    duration: "7 meses",
    hours: "480 horas",
    features: [
      "Instrutor Qualificado",
      "Material didático incluso",
      "Certificação reconhecida pelo MEC",
    ],
  },
  {
    title: "Curso CTI: Terapia Intensiva",
    description: "Qualificação em Terapia Intensiva (CTI).",
    imageSrc: "/TerapiaIntensiva.jpg",
    imageAlt: "Terapia Intensiva",
    duration: "8 meses",
    hours: "680 horas",
    features: [
      "Instrutor Qualificado",
      "Material didático incluso",
      "Certificação reconhecida pelo MEC",
    ],
  },
  {
    title: "Laboratório Clínico e Hospitalar",
    description: "Qualificação em enfermagem Laboratorial.",
    imageSrc: "/laboratorio.jpg",
    imageAlt: "Laboratorio Clinico e Hospitalar",
    duration: "5 meses",
    hours: "200 horas",
    features: [
      "Instrutor Qualificado",
      "Material didático incluso",
      "Certificação reconhecida pelo MEC",
    ],
  },
  {
    title: "Maternidade e Obstetrícia",
    description: "Qualificação em Maternidade e Obstetrícia.",
    imageSrc: "/maternidade.webp",
    imageAlt: "Maternidade e Obstetrícia",
    duration: "5 meses",
    hours: "400 horas",
    features: [
      "Instrutor Qualificado",
      "Material didático incluso",
      "Certificação reconhecida pelo MEC",
    ],
  },
  {
    title: "UTI Neonatal e Pediátrica",
    description: "Qualificação em UTI Neonatal e Pediátrica.",
    imageSrc: "/A166.jpeg",
    imageAlt: "Neonatal e Pediátrica",
    duration: "6 meses",
    hours: "300 horas",
    features: [
      "Instrutor Qualificado",
      "Material didático incluso",
      "Certificação reconhecida pelo MEC",
    ],
  },
];

export default function Courses() {
  const pageSize = 3;
  const totalPages = Math.max(1, Math.ceil(courses.length / pageSize));
  const [page, setPage] = useState(0);

  const visibleCourses = useMemo(() => {
    const start = page * pageSize;
    return courses.slice(start, start + pageSize);
  }, [page]);

  function prev() {
    setPage((p) => (p - 1 + totalPages) % totalPages);
  }

  function next() {
    setPage((p) => (p + 1) % totalPages);
  }

  return (
    <section id="cursos" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
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
          {visibleCourses.map((course, index) => (
            <CourseCard key={`${course.title}-${index}`} {...course} />
          ))}
        </div>

        <div className="mt-4 flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={prev}
            className="h-10 w-10 rounded-full p-0"
            aria-label="Cursos anteriores"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <p className="text-muted-foreground text-sm">
            Página {page + 1} de {totalPages}
          </p>

          <Button
            type="button"
            variant="outline"
            onClick={next}
            className="h-10 w-10 rounded-full p-0"
            aria-label="Próximos cursos"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
