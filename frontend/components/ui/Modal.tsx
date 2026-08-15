import { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  children: ReactNode;
  title?: string;
  open: boolean;
  onClose: () => void;
  className?: string;
}

export default function Modal({ children, title, open, onClose, className }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--overlay-dark)] p-4 backdrop-blur-sm">
      <div className={cn("w-full max-w-md rounded-[32px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-modal)] backdrop-blur-2xl", className)}>
        <div className="mb-4 flex items-center justify-between">
          {title ? <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3> : <div />}
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[var(--surface)] p-2 text-[var(--text)] transition hover:bg-[var(--surface-2)]"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
