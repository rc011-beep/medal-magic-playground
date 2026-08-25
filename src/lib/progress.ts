import { useCallback, useEffect, useState } from "react";

export type ModuleId =
  | "modulo-1"
  | "modulo-2"
  | "modulo-3"
  | "modulo-final"
  | "modulo-5"
  | "modulo-6"
  | "modulo-7";

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
    medalName: "Guardián del Negocio",
    medalIcon: "🥇",
    medalDescription: "Demostraste dominio en los casos avanzados.",
  },
  {
    id: "modulo-final",
    title: "Módulo 4 · Certificación",
    summary: "Proyecto integrador y evaluación final.",
    medalName: "Estrella de Ventas",
    medalIcon: "🏆",
    medalDescription: "Cerraste la primera etapa del programa. ¡Felicidades!",
  },
  {
    id: "modulo-5",
    title: "Módulo 5 · Visión estratégica",
    summary: "Análisis profundo y detección de detalles clave.",
    medalName: "Ojo de Águila",
    medalIcon: "🦅",
    medalDescription: "Desarrollaste una visión aguda para detectar oportunidades.",
  },
  {
    id: "modulo-6",
    title: "Módulo 6 · Construcción de valor",
    summary: "Diseño y estructura de propuestas de negocio sólidas.",
    medalName: "Arquitecto de Negocios",
    medalIcon: "🏗️",
    medalDescription: "Construiste las bases de negocios escalables.",
  },
  {
    id: "modulo-7",
    title: "Módulo 7 · Cierre y proyección",
    summary: "Identificación de oportunidades y plan de acción continuo.",
    medalName: "Buscador de Oportunidades",
    medalIcon: "🔍",
    medalDescription: "Cerraste el programa con una mentalidad de crecimiento.",
  },
];

export type Exercise = { a: number; b: number };

export const EXERCISES: Record<ModuleId, Exercise[]> = {
  "modulo-1": [{ a: 12, b: 13 }],
  "modulo-2": [{ a: 27, b: 18 }],
  "modulo-3": [{ a: 57, b: 38 }],
  "modulo-final": [{ a: 68, b: 57 }],
  "modulo-5": [{ a: 45, b: 39 }],
  "modulo-6": [{ a: 83, b: 29 }],
  "modulo-7": [{ a: 76, b: 65 }],
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
  "modulo-5": 0,
  "modulo-6": 0,
  "modulo-7": 0,
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
