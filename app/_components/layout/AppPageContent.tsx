import { cn } from "@/app/_lib/utils";

type AppPageContentProps = {
  children: React.ReactNode;
  className?: string;
};

export function AppPageContent({ children, className }: AppPageContentProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-4 py-6 sm:px-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
