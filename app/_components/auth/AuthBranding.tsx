import { Zap } from "lucide-react";
import { ReactNode } from "react";

interface AuthBrandingProps {
  title: ReactNode;
  subtitle: string;
}

export function AuthBranding({ title, subtitle }: AuthBrandingProps) {
  return (
    <div className="from-primary via-primary/90 to-primary/80 relative hidden flex-col justify-between overflow-hidden bg-linear-to-br p-12 lg:flex lg:w-1/2">
      <div className="absolute inset-0 opacity-10">
        <div className="bg-primary-foreground absolute top-20 left-10 h-72 w-72 rounded-full blur-3xl" />
        <div className="bg-primary-foreground absolute right-10 bottom-20 h-96 w-96 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-primary-foreground/20 flex h-12 w-12 items-center justify-center rounded-xl backdrop-blur-sm">
            <Zap className="text-primary-foreground h-6 w-6" />
          </div>
          <span className="text-primary-foreground text-2xl font-bold">
            Unienf
          </span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-6">
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
