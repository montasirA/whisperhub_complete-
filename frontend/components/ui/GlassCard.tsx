import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export default function GlassCard({ children, className, hoverable = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-[30px] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow)] backdrop-blur-2xl",
        hoverable && "transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--card-hover)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
