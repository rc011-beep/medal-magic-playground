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
    medalName: "Medalla de Iniciación",
    medalIcon: "🥉",
    medalDescription: "Completaste los fundamentos del programa.",
  },
  {
    id: "modulo-2",
    title: "Módulo 2 · Práctica guiada",
    summary: "Ejercicios aplicados con acompañamiento.",
    medalName: "Medalla de Constancia",
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

  const completeModule = useCallback(
    (id: ModuleId) => {
      persist({ ...read(), [id]: 100 });
    },
    [persist],
  );

  const resetAll = useCallback(() => {
    persist({ ...EMPTY_PROGRESS });
  }, [persist]);

  return { progress, hydrated, completeModule, resetAll };
}
