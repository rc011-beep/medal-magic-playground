import { useState } from "react";
import { MODULES, type ModuleId, type Progress } from "@/lib/progress";
import { Button } from "@/components/ui/button";

export function DevPanel({
  progress,
  onComplete,
  onReset,
}: {
  progress: Progress;
  onComplete: (id: ModuleId) => void;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3">
      {open && (
        <div className="w-72 rounded-2xl border border-border bg-card p-4 shadow-xl animate-in slide-in-from-bottom-2 fade-in">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Entorno de pruebas
          </p>
          <p className="mt-1 text-sm text-foreground">Simular completitud de módulos</p>
          <div className="mt-4 space-y-2">
            {MODULES.map((m, i) => {
              const done = progress[m.id] >= 100;
              const prev = MODULES[i - 1];
              const locked = !!prev && progress[prev.id] < 100;
              return (
                <Button
                  key={m.id}
                  variant={done ? "secondary" : "default"}
                  size="sm"
                  className="w-full justify-between"
                  disabled={locked}
                  onClick={() => onComplete(m.id)}
                >
                  <span>{m.title.split(" · ")[0]}</span>
                  <span aria-hidden>{done ? "✓ 100%" : locked ? "🔒" : m.medalIcon}</span>
                </Button>
              );
            })}
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="mt-4 w-full"
            onClick={onReset}
          >
            Restablecer todo el progreso
          </Button>
        </div>
      )}

      <Button
        size="lg"
        className="rounded-full shadow-lg"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? "Cerrar pruebas" : "🛠 Panel de pruebas"}
      </Button>
    </div>
  );
}
