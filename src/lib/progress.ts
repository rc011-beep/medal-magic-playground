import { useCallback, useEffect, useState } from "react";

export type ModuleId = "modulo-1" | "modulo-2" | "modulo-3" | "modulo-final";

export type ModuleDef = {
  id: ModuleId;
  title: string;
  summary: string;
  medalName: string;
  medalIcon: string;
  medalDescription: string;
};

export const MODULES: ModuleDef[] = [
  {
    id: "modulo-1",
    title: "Módulo 1 · Fundamentos",
    summary: "Conceptos base y primeros pasos del programa.",
    medalName: "Mente de Acero",
    medalIcon: "🧠",
    medalDescription: "Completaste los fundamentos del programa.",
  },
  {
    id: "modulo-2",
    title: "Módulo 2 · Práctica guiada",
    summary: "Ejercicios aplicados con acompañamiento.",
    medalName: "Explorador de Talentos",
    medalIcon: "🥈",
    medalDescription: "Superaste la práctica guiada sin rendirte.",
  },
  {
    id: "modulo-3",
    title: "Módulo 3 · Dominio",
    summary: "Casos avanzados y resolución autónoma.",
    medalName: "Medalla de Dominio",
    medalIcon: "🥇",
    medalDescription: "Demostraste dominio en los casos avanzados.",
  },
  {
    id: "modulo-final",
    title: "Módulo Final · Certificación",
    summary: "Proyecto integrador y evaluación final.",
    medalName: "Medalla de Excelencia",
    medalIcon: "🏆",
    medalDescription: "Cerraste el programa completo. ¡Felicidades!",
  },
];

export type Exercise = { a: number; b: number };

export const EXERCISES: Record<ModuleId, Exercise[]> = {
  "modulo-1": [{ a: 12, b: 13 }],
  "modulo-2": [{ a: 27, b: 18 }],
  "modulo-3": [{ a: 57, b: 38 }],
  "modulo-final": [{ a: 68, b: 57 }],
};

export function getHints(a: number, b: number): string[] {
  const sum = a + b;
  const tens = (n: number) => Math.floor(n / 10) * 10;
  const units = (n: number) => n % 10;

  const ta = tens(a);
  const ua = units(a);
  const tb = tens(b);
  const ub = units(b);
  const sumTens = ta + tb;
  const sumUnits = ua + ub;

  const hints: string[] = ["Casi. Revisa tu suma e inténtalo de nuevo."];

  if (ta > 0 || tb > 0) {
    hints.push(
      `Pista: separa las decenas y las unidades. ${a} = ${ta} + ${ua}, ${b} = ${tb} + ${ub}`,
      `Suma las decenas: ${ta} + ${tb} = ${sumTens}. Suma las unidades: ${ua} + ${ub} = ${sumUnits}.`,
      `Ahora suma todo: ${sumTens} + ${sumUnits} = ${sum}.`,
    );
  } else {
    hints.push(
      `Pista: cuenta desde ${a} ${b} números más hasta llegar a ${sum}.`,
    );
  }

  return hints;
}

export type Progress = Record<ModuleId, number>;

export const EMPTY_PROGRESS: Progress = {
  "modulo-1": 0,
  "modulo-2": 0,
  "modulo-3": 0,
  "modulo-final": 0,
};

const STORAGE_KEY = "medallas.progreso.v1";

function read(): Progress {
  if (typeof window === "undefined") return EMPTY_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return { ...EMPTY_PROGRESS, ...parsed };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(EMPTY_PROGRESS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProgress(read());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: Progress) => {
    setProgress(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* almacenamiento no disponible */
    }
  }, []);

  const setModuleProgress = useCallback(
    (id: ModuleId, value: number) => {
      persist({ ...read(), [id]: Math.max(0, Math.min(100, Math.round(value))) });
    },
    [persist],
  );

  const completeModule = useCallback(
    (id: ModuleId) => {
      persist({ ...read(), [id]: 100 });
    },
    [persist],
  );

  const resetAll = useCallback(() => {
    persist({ ...EMPTY_PROGRESS });
  }, [persist]);

  return { progress, hydrated, completeModule, setModuleProgress, resetAll };
}
