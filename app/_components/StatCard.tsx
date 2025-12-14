import { cn } from "@/app/_lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "muted";
  trend?: string;
  className?: string;
}

const variantStyles = {
  default: "bg-primary/5 border-primary/20",
  success: "bg-success/5 border-success/20",
  warning: "bg-warning/5 border-warning/20",
  muted: "bg-card border-border/50",
};

const iconVariantStyles = {
  default: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  muted: "bg-muted text-muted-foreground",
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  variant = "default",
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "shadow-soft hover-lift rounded-2xl border p-6 transition-all duration-300",
        variantStyles[variant],
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground mb-1 text-sm font-medium">
            {label}
          </p>
          <p className="text-foreground text-3xl font-bold">{value}</p>
          {trend && (
            <p className="text-success mt-2 text-sm font-medium">{trend}</p>
          )}
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            iconVariantStyles[variant],
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
