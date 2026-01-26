import { cn } from "@/app/_lib/utils";

interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
  variant?: "default" | "primary";
}


export default function ActivityItem({
  title,
  description,
  time,
  variant = "default",
}: ActivityItemProps) {
  return (
    <div className="border-border/50 flex items-start gap-3 border-b pb-4 last:border-0 last:pb-0">
      <div
        className={cn(
          "mt-2 h-2 w-2 rounded-full",
          variant === "primary" ? "bg-primary" : "bg-muted",
        )}
      />
      <div className="min-w-0 flex-1">
        <p className="text-foreground text-sm font-medium">{title}</p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <span className="text-muted-foreground text-xs whitespace-nowrap">
        {time}
      </span>
    </div>
  );
}
