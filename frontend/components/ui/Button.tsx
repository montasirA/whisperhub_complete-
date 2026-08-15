import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/30 disabled:cursor-not-allowed disabled:opacity-60";
    const variants = {
      primary: "bg-gradient-to-r from-[var(--primary)] via-[var(--button-accent)] to-[var(--secondary)] text-[var(--button-text)] shadow-[var(--button-shadow)] hover:-translate-y-0.5 hover:shadow-[var(--button-shadow-hover)]",
      secondary: "border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] backdrop-blur-xl hover:-translate-y-0.5 hover:bg-[var(--surface-2)]",
      ghost: "bg-transparent text-[var(--text)] hover:bg-[var(--surface)]",
    };
    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2.5 text-sm",
      lg: "px-5 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export default Button;
