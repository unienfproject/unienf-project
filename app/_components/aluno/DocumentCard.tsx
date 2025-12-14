import { cn } from "@/app/_lib/utils";
import { CircleCheckBig, CircleX, Clock, FileText, Upload } from "lucide-react";
import { Button } from "../ui/button";

interface DocumentCardProps {
  title: string;
  status: "approved" | "pending" | "rejected";
  fileName?: string;
  uploadDate?: string;
  errorMessage?: string;
  onAction?: () => void;
}

const statusConfig = {
  approved: {
    icon: CircleCheckBig,
    iconColor: "text-success",
    borderColor: "border-success/20",
    badgeText: "Aprovado",
    badgeColor: "bg-success/10 text-success",
    buttonText: "Documento Aprovado",
    buttonIcon: CircleCheckBig,
    buttonVariant: "outline" as const,
  },
  pending: {
    icon: Clock,
    iconColor: "text-warning",
    borderColor: "border-warning/20",
    badgeText: "Pendente",
    badgeColor: "bg-warning/10 text-warning",
    buttonText: "Enviar Documento",
    buttonIcon: Upload,
    buttonVariant: "default" as const,
  },
  rejected: {
    icon: CircleX,
    iconColor: "text-destructive",
    borderColor: "border-destructive/20",
    badgeText: "Rejeitado",
    badgeColor: "bg-destructive/10 text-destructive",
    buttonText: "Enviar Novamente",
    buttonIcon: Upload,
    buttonVariant: "destructive" as const,
  },
};

export default function DocumentCard({
  title,
  status,
  fileName,
  uploadDate,
  errorMessage,
  onAction,
}: DocumentCardProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const ButtonIcon = config.buttonIcon;

  return (
    <div
      className={cn(
        "bg-card shadow-soft rounded-2xl border p-6 transition-all duration-300",
        config.borderColor,
      )}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Icon className={cn("h-6 w-6", config.iconColor)} />
          <div>
            <h4 className="text-foreground font-semibold">{title}</h4>
            <span
              className={cn(
                "mt-1 inline-flex rounded-full px-2 py-1 text-xs font-medium",
                config.badgeColor,
              )}
            >
              {config.badgeText}
            </span>
          </div>
        </div>
      </div>
      {fileName && uploadDate && (
        <div className="bg-muted/30 mb-4 flex items-center gap-2 rounded-lg p-3">
          <FileText className="text-muted-foreground h-4 w-4" />
          <span className="text-muted-foreground flex-1 truncate text-sm">
            {fileName}
          </span>
          <span className="text-muted-foreground text-xs">{uploadDate}</span>
        </div>
      )}
      {errorMessage && (
        <div className="bg-destructive/5 border-destructive/10 mb-4 rounded-lg border p-3">
          <p className="text-destructive text-sm">{errorMessage}</p>
        </div>
      )}
      <Button
        variant={config.buttonVariant}
        className="ring-offset-background focus-visible:ring-ring inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap shadow-sm transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
        onClick={onAction}
      >
        <ButtonIcon className="mr-2 h-4 w-4" />
        {config.buttonText}
      </Button>
    </div>
  );
}
