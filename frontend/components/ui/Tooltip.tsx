import { ReactNode } from "react";

interface TooltipProps {
  label: string;
  children: ReactNode;
}

export default function Tooltip({ label, children }: TooltipProps) {
  return (
    <div className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute -top-10 left-1/2 z-20 -translate-x-1/2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--text)] opacity-0 shadow-lg transition group-hover:opacity-100">
        {label}
      </span>
    </div>
  );
}
