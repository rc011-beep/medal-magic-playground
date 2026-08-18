import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MODULES, useProgress, type ModuleDef, type ModuleId } from "@/lib/progress";
import { MedalModal } from "@/components/MedalModal";
import { DevPanel } from "@/components/DevPanel";
import { ExerciseDialog } from "@/components/ExerciseDialog";
import { Button } from "@/components/ui/button";
import { Progress as ProgressBar } from "@/components/ui/progress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ruta de aprendizaje · Módulos y medallas" },
      {
        name: "description",
        content:
          "Avanza por los módulos del programa, desbloquea medallas y revisa tus logros en un panel interactivo.",
      },
      { property: "og:title", content: "Ruta de aprendizaje · Módulos y medallas" },
      {
        property: "og:description",
        content:
          "Avanza por los módulos del programa, desbloquea medallas y revisa tus logros.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { progress, hydrated, completeModule, setModuleProgress, resetAll } =
    useProgress();
  const [celebrating, setCelebrating] = useState<ModuleDef | null>(null);
  const [practicing, setPracticing] = useState<ModuleDef | null>(null);

  const earned = MODULES.filter((m) => progress[m.id] >= 100);
  const overall = Math.round(
    MODULES.reduce((sum, m) => sum + progress[m.id], 0) / MODULES.length,
  );

  const handleComplete = (id: ModuleId) => {
    completeModule(id);
    const mod = MODULES.find((m) => m.id === id) ?? null;
    setCelebrating(mod);
  };

  return (
    <main className="min-h-screen bg-background pb-32">
      <header className="border-b border-border bg-gradient-hero">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            Programa de formación
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">
            Tu ruta de aprendizaje
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Completa cada módulo para desbloquear medallas y llegar a la certificación
            final.
          </p>
          <div className="mt-8 max-w-md">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Progreso general</span>
              <span className="font-semibold text-foreground">
                {hydrated ? overall : 0}%
              </span>
            </div>
            <ProgressBar value={hydrated ? overall : 0} className="mt-2" />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <h2 className="text-lg font-semibold text-foreground">Módulos</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {MODULES.map((m) => {
            const value = hydrated ? progress[m.id] : 0;
            const done = value >= 100;
            return (
              <article
                key={m.id}
                className={`rounded-2xl border p-5 transition-colors ${
                  done ? "border-accent bg-accent/5" : "border-border bg-card"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-foreground">{m.title}</h3>
                  <span className="text-2xl" aria-hidden>
                    {done ? m.medalIcon : "🔒"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{m.summary}</p>
                <ProgressBar value={value} className="mt-4" />
                <p className="mt-2 text-xs text-muted-foreground">{value}% completado</p>
                <Button
                  variant={done ? "secondary" : "default"}
                  size="sm"
                  className="mt-4 w-full"
                  onClick={() => setPracticing(m)}
                >
                  {done ? "Repasar ejercicios" : "Resolver ejercicios"}
                </Button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-12">
        <h2 className="text-lg font-semibold text-foreground">Mis Logros</h2>
        <p className="text-sm text-muted-foreground">
          {hydrated ? earned.length : 0} de {MODULES.length} medallas desbloqueadas
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-4">
          {MODULES.map((m) => {
            const unlocked = hydrated && progress[m.id] >= 100;
            return (
              <div
                key={m.id}
                className={`rounded-2xl border p-5 text-center transition-all ${
                  unlocked
                    ? "border-accent bg-card shadow-glow"
                    : "border-dashed border-border bg-muted/40"
                }`}
              >
                <div
                  className={`mx-auto flex size-14 items-center justify-center rounded-full text-3xl ${
                    unlocked ? "bg-gradient-medal" : "bg-muted grayscale opacity-50"
                  }`}
                  aria-hidden
                >
                  {unlocked ? m.medalIcon : "🔒"}
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">
                  {m.medalName}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {unlocked ? m.medalDescription : "Bloqueada"}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <DevPanel progress={progress} onComplete={handleComplete} onReset={resetAll} />
      <ExerciseDialog
        module={practicing}
        onClose={() => setPracticing(null)}
        onProgress={(value) => {
          if (practicing) setModuleProgress(practicing.id, value);
        }}
        onComplete={() => {
          if (!practicing) return;
          completeModule(practicing.id);
          setCelebrating(practicing);
          setPracticing(null);
        }}
      />
      <MedalModal module={celebrating} onClose={() => setCelebrating(null)} />
    </main>
  );
}
