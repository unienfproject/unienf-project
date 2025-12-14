import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="bg-card border-border/50 shadow-soft hover-lift animate-scale-in rounded-2xl border p-6">
      <div className="bg-primary/10 mb-5 flex h-14 w-14 items-center justify-center rounded-xl">
        <Icon className="text-primary h-7 w-7" />
      </div>
      <h3 className="text-foreground mb-3 text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
