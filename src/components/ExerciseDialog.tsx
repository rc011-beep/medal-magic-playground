import { useEffect, useState } from "react";
import { EXERCISES, type ModuleDef } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress as ProgressBar } from "@/components/ui/progress";

export function ExerciseDialog({
  module,
  onClose,
  onProgress,
  onComplete,
}: {
  module: ModuleDef | null;
  onClose: () => void;
  onProgress: (value: number) => void;
  onComplete: () => void;
}) {
  const [step, setStep] = useState(0);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  useEffect(() => {
    setStep(0);
    setValue("");
    setStatus("idle");
  }, [module?.id]);

  if (!module) return null;

  const exercises = EXERCISES[module.id];
  const current = exercises[step];
  if (!current) return null;
  const pct = Math.round((step / exercises.length) * 100);

  const check = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(value) !== current.a + current.b) {
      setStatus("error");
      return;
    }
    const next = step + 1;
    setValue("");
    setStatus("ok");
    onProgress(Math.round((next / exercises.length) * 100));
    if (next >= exercises.length) {
      onComplete();
      return;
    }
    setStep(next);
    setTimeout(() => setStatus("idle"), 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={`Ejercicios de ${module.title}`}
      onClick={onClose}
    >
      <form
        onSubmit={check}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl border border-border bg-card p-7 shadow-2xl animate-in zoom-in-95 duration-200"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {module.title}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Ejercicio {step + 1} de {exercises.length} · resuelve la suma
        </p>
        <ProgressBar value={pct} className="mt-3" />

        <div className="mt-7 text-center text-4xl font-bold tabular-nums text-foreground">
          {current.a} + {current.b} = ?
        </div>

        <Input
          autoFocus
          inputMode="numeric"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setStatus("idle");
          }}
          placeholder="Tu respuesta"
          aria-label="Tu respuesta"
          className={`mt-6 text-center text-lg ${
            status === "error" ? "border-destructive" : ""
          }`}
        />
        {status === "error" && (
          <p className="mt-2 text-center text-sm text-destructive">
            Casi. Revisa tu suma e inténtalo de nuevo.
          </p>
        )}
        {status === "ok" && (
          <p className="mt-2 text-center text-sm text-accent">¡Correcto!</p>
        )}

        <div className="mt-6 flex gap-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Salir
          </Button>
          <Button type="submit" className="flex-1" disabled={value.trim() === ""}>
            Comprobar
          </Button>
        </div>
      </form>
    </div>
  );
}
