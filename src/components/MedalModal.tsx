import type { ModuleDef } from "@/lib/progress";
import { Button } from "@/components/ui/button";

export function MedalModal({
  module,
  onClose,
}: {
  module: ModuleDef | null;
  onClose: () => void;
}) {
  if (!module) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Medalla desbloqueada"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card p-8 text-center shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
      >
        <div className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-gradient-medal opacity-30 blur-3xl" />
        <div className="relative">
          <div className="mx-auto flex size-24 animate-medal-pop items-center justify-center rounded-full bg-gradient-medal text-5xl shadow-glow">
            <span aria-hidden>{module.medalIcon}</span>
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            ¡Felicidades!
          </p>
          <h2 className="mt-2 text-2xl font-bold text-foreground">{module.medalName}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{module.medalDescription}</p>
          <Button className="mt-6 w-full" onClick={onClose}>
            Ver mis logros
          </Button>
        </div>
      </div>
    </div>
  );
}
