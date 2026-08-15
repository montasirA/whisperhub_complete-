import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  color?: string;
  emoji?: string;
}

export default function Avatar({ name, size = "md", color = "var(--primary)", emoji = "✨" }: AvatarProps) {
  const sizes = {
    sm: "h-10 w-10 text-sm",
    md: "h-12 w-12 text-base",
    lg: "h-16 w-16 text-xl",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full border border-[var(--border)] font-semibold text-[var(--button-text)] shadow-lg",
        sizes[size],
      )}
      style={{ background: `linear-gradient(135deg, ${color}, var(--avatar-highlight))` }}
      aria-label={name}
    >
      <span>{emoji}</span>
    </div>
  );
}
