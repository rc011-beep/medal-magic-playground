import { useEffect } from "react";
import confetti from "canvas-confetti";
import type { ModuleDef } from "@/lib/progress";
import { Button } from "@/components/ui/button";

function Trumpet({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 32" className={className} aria-hidden fill="none">
      <path
        d="M4 16 L26 6 L26 26 Z"
        fill="url(#trumpetGold)"
        stroke="oklch(0.55 0.12 60)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <rect
        x="26"
        y="12"
        width="26"
        height="8"
        rx="3"
        fill="url(#trumpetGold)"
        stroke="oklch(0.55 0.12 60)"
        strokeWidth="1"
      />
      <rect x="34" y="6" width="4" height="7" rx="1.5" fill="oklch(0.7 0.14 62)" />
      <rect x="42" y="6" width="4" height="7" rx="1.5" fill="oklch(0.7 0.14 62)" />
      <defs>
        <linearGradient id="trumpetGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.92 0.14 88)" />
          <stop offset="60%" stopColor="oklch(0.78 0.17 62)" />
          <stop offset="100%" stopColor="oklch(0.62 0.13 45)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function MedalModal({
  module,
  onClose,
}: {
  module: ModuleDef | null;
  onClose: () => void;
}) {
  const open = !!module;

  useEffect(() => {
    if (!open) return;
    const colors = ["#FFD35C", "#F5A524", "#FFF1C9", "#E2872A"];
    const end = Date.now() + 1400;

    confetti({
      particleCount: 140,
      spread: 100,
      origin: { y: 0.6 },
      colors,
      disableForReducedMotion: true,
    });

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.7 },
        colors,
        disableForReducedMotion: true,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.7 },
        colors,
        disableForReducedMotion: true,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    const id = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(id);
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
      {/* Trompetas laterales */}
      <Trumpet className="pointer-events-none absolute left-0 top-1/2 h-16 w-32 -translate-y-24 animate-trumpet-left" />
      <Trumpet className="pointer-events-none absolute right-0 top-1/2 h-16 w-32 -translate-y-24 -scale-x-100 animate-trumpet-right" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card p-8 text-center shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
      >
        <div className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-gradient-medal opacity-30 blur-3xl" />
        <div className="relative">
          <div className="relative mx-auto flex size-24 items-center justify-center">
            {/* Halo giratorio */}
            <div className="pointer-events-none absolute -inset-8 animate-halo-spin bg-halo-rays opacity-70" />
            {/* Destellos dorados */}
            <div className="pointer-events-none absolute -inset-4 animate-glow-pulse rounded-full bg-gradient-medal opacity-40 blur-xl" />
            <div className="relative flex size-24 animate-medal-bounce items-center justify-center rounded-full bg-gradient-medal text-5xl shadow-glow">
              <span aria-hidden>{module.medalIcon}</span>
            </div>
            <span className="pointer-events-none absolute -right-2 -top-1 animate-sparkle text-xl">
              ✨
            </span>
            <span
              className="pointer-events-none absolute -left-3 bottom-0 animate-sparkle text-lg"
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
          <Button className="mt-6 w-full" onClick={onClose}>
            Ver mis logros
          </Button>
        </div>
      </div>
    </div>
  );
}
