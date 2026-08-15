import { InputHTMLAttributes, forwardRef, ElementType } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ElementType;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, icon: Icon, ...props }, ref) => {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-[var(--text)]">
      {label ? <span>{label}</span> : null}
      <div className="relative">
        {Icon ? (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]">
            <Icon size={16} />
          </div>
        ) : null}
        <input
          ref={ref}
          className={cn(
            "w-full rounded-[22px] border border-[var(--input-border)] bg-[var(--input)] px-4 py-3.5 text-sm text-[var(--text)] shadow-[var(--shadow-soft)] outline-none ring-0 transition-all placeholder:text-[var(--muted)] focus:border-[color:var(--primary)] focus:bg-[var(--surface-2)] focus:shadow-[var(--shadow-glow)]",
            Icon ? "pl-10" : "pl-4",
            className,
          )}
          {...props}
        />
      </div>
    </label>
  );
});

Input.displayName = "Input";

export default Input;
