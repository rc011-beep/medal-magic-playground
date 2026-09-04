import { useEffect, useRef } from "react";
import type { ModuleDef } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { burstConfetti, burstFromElement, sideCannons } from "@/lib/celebrate";

export function MedalModal({
  module,
  onClose,
}: {
  module: ModuleDef | null;
  onClose: () => void;
}) {
  const open = !!module;
  const medalRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    burstConfetti();
    return sideCannons();
  }, [open, module?.id]);

  if (!module) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-foreground/50 p-4 backdrop-blur-sm animate-in fade-in"
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
          <div className="relative mx-auto flex size-16 items-center justify-center">
            {/* Halo giratorio */}
            <div className="pointer-events-none absolute -inset-6 animate-halo-spin bg-halo-rays opacity-70" />
            {/* Destellos dorados */}
            <div className="pointer-events-none absolute -inset-3 animate-glow-pulse rounded-full bg-gradient-medal opacity-40 blur-xl" />
            <button
              ref={medalRef}
              type="button"
              aria-label={`Celebrar ${module.medalName} otra vez`}
              onClick={() => medalRef.current && burstFromElement(medalRef.current)}
              className="relative flex size-16 animate-medal-bounce items-center justify-center rounded-full bg-gradient-medal text-3xl shadow-glow transition-transform hover:scale-110 active:scale-95"
            >
              <span aria-hidden>{module.medalIcon}</span>
            </button>
            <span className="pointer-events-none absolute -right-2 -top-1 animate-sparkle text-base">
              ✨
            </span>
            <span
              className="pointer-events-none absolute -left-3 bottom-0 animate-sparkle text-sm"
              style={{ animationDelay: "0.35s" }}
            >
              ✨
            </span>
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            ¡Felicidades!
          </p>
          <h2 className="mt-2 text-2xl font-bold text-foreground">{module.medalName}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{module.medalDescription}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Toca la medalla para volver a celebrar 🎉
          </p>
          <Button className="mt-6 w-full" onClick={onClose}>
            Ver mis logros
          </Button>
        </div>
      </div>
    </div>
  );
}
