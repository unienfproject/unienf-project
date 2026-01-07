import { ArrowRight, Award, BookOpen, Clock } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

interface CourseCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  duration: string;
  hours?: string;
  features: string[];
  buttonText?: string;
}

export default function CourseCard({
  title,
  description,
  imageSrc,
  imageAlt,
  duration,
  hours,
  features,
  buttonText = "Entre em Contato",
}: CourseCardProps) {
  return (
    <div className="bg-card border-border/50 shadow-soft hover-lift group animate-slide-up overflow-hidden rounded-2xl border">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={500}
          height={500}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="from-foreground/60 absolute inset-0 bg-linear-to-t to-transparent"></div>
      </div>
      <div className="p-6">
        <h3 className="text-foreground mb-3 text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
          {description}
        </p>
        <div className="mb-4 flex items-center gap-4">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <BookOpen className="text-primary h-4 w-4" />
            {duration}
          </div>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Clock className="text-primary h-4 w-4" />
            {hours}
          </div>
        </div>
        <div className="mb-6 space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <Award className="text-success h-4 w-4" />
              <span className="text-foreground">{feature}</span>
            </div>
          ))}
        </div>
        <Button className="ring-offset-background focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap shadow-sm transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
          <Link
            href="https://wa.me/5511987654321"
            target="_blank"
            className="text-primary-foreground flex items-center gap-2"
          >
            {buttonText}
            <ArrowRight className="flex h-4 w-4 items-center justify-center" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
