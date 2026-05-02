import { cn } from "@/app/_lib/utils";

type AppPageContentProps = {
  children: React.ReactNode;
  className?: string;
};

export function AppPageContent({ children, className }: AppPageContentProps) {
  return (
    <div
      className={cn("w-full px-4 py-6 sm:px-6 lg:px-8", className)}
    >
      {children}
    </div>
  );
}
