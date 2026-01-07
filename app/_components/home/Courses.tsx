"use client";

import { useEffect, useMemo, useState } from "react";
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
      "Certificação reconhecida pelo mercado de trabalho",
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
      "Certificação reconhecida pelo mercado de trabalho",
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
      "Certificação reconhecida pelo mercado de trabalho",
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
      "Certificação reconhecida pelo mercado de trabalho",
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
      "Certificação reconhecida pelo mercado de trabalho",
    ],
  },
];

export default function Courses() {
  const visibleCount = 3;
  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleCourses = useMemo(() => {
    return Array.from({ length: visibleCount }).map((_, i) => {
      const index = (currentIndex + i) % courses.length;
      return courses[index];
    });
  }, [currentIndex]);

  const [itemsToShow, setItemsToShow] = useState(4);

  // Ajustar quantidade de logos baseado no tamanho da tela
  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(1); // Mobile: 1 logo
      } else if (window.innerWidth < 1024) {
        setItemsToShow(2); // Tablet: 2 logos
      } else {
        setItemsToShow(4); // Desktop: 4 logos
      }
    };

    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, []);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % courses.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + courses.length) % courses.length);
  };

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % courses.length);
    }, 3000);

    return () => clearInterval(id);
  }, []);

  const [coursesIndex, setCoursesIndex] = useState(0);

  const goToNextCourses = () => {
    setCoursesIndex((prev) => (prev + 1) % courses.length);
  };

  const goToPreviousCourses = () => {
    setCoursesIndex((prev) => (prev - 1 + courses.length) % courses.length);
  };

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
        {/* Navegação */}
        <div className="mt-4 flex items-center justify-center gap-3 sm:mt-6 sm:gap-4">
          <button
            onClick={goToPrevious}
            className="text-muted-foreground hover:text-foreground cursor-pointer rounded-full p-2 transition-colors"
            aria-label="Logos anteriores"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="flex gap-1.5 sm:gap-2">
            {courses.map((_, index) => {
              // Ajustar lógica de indicadores baseado em itemsToShow
              let isActive = false;
              if (itemsToShow === 1) {
                isActive = index === currentIndex;
              } else if (itemsToShow === 2) {
                isActive =
                  index === currentIndex ||
                  (currentIndex + 1) % courses.length === index;
              } else {
                isActive =
                  index === currentIndex ||
                  (currentIndex + 1) % courses.length === index ||
                  (currentIndex + 2) % courses.length === index ||
                  (currentIndex + 3) % courses.length === index;
              }
              return (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1.5 rounded-full transition-all sm:h-2 ${
                    isActive
                      ? "bg-primary w-6 sm:w-8"
                      : "bg-muted-foreground/30 w-1.5 sm:w-2"
                  }`}
                  aria-label={`Ir para logo ${index + 1}`}
                />
              );
            })}
          </div>

          <button
            onClick={goToNext}
            className="text-muted-foreground hover:text-foreground cursor-pointer rounded-full p-2 transition-colors"
            aria-label="Próximas logos"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
