import Image from "next/image";
import { ReactNode } from "react";

interface AuthBrandingProps {
  title: ReactNode;
  subtitle: string;
}

export function AuthBranding({ title, subtitle }: AuthBrandingProps) {
  return (
    <div className="from-primary via-primary/90 to-primary/80 relative hidden flex-col items-center justify-between overflow-hidden bg-linear-to-br p-12 lg:flex lg:w-1/2">
      <div className="relative z-10 flex flex-1 flex-col justify-center gap-6">
        <Image
          src="/logo-unienf-branca.png"
          alt="Logo da UNIENF"
          width={250}
          height={250}
        />
        <h1 className="text-primary-foreground text-4xl leading-tight font-bold">
          {title}
        </h1>
        <p className="text-primary-foreground/80 max-w-md text-lg">
          {subtitle}
        </p>
      </div>

      <div className="text-primary-foreground/60 relative z-10 text-sm">
        © {new Date().getFullYear()} UniEnf. São Pedro da Aldeia.
      </div>
    </div>
  );
}
