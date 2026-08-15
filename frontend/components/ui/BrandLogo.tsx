import { Sparkles } from "lucide-react";

export default function BrandLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)] text-[var(--button-text)] shadow-[var(--button-shadow)]">
        <Sparkles size={20} />
      </div>
      <div>
        <p className="text-lg font-semibold text-[var(--text)]">WhisperHub</p>
        <p className="text-xs text-[var(--muted)]">Some conversations are easier with strangers.</p>
      </div>
    </div>
  );
}
