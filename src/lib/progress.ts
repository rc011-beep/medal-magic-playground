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
    title: "Módulo 1 · Principios y mentalidad emprendedora",
    summary: "Adopta la mentalidad y los principios que impulsan a los emprendedores.",
    medalName: "Mente de Acero",
    medalIcon: "🚀",
    medalDescription: "Construiste una mentalidad firme para emprender.",
  },
  {
    id: "modulo-2",
    title: "Módulo 2 · Propósito",
    summary: "Encuentra el propósito que guía tu proyecto de impacto.",
    medalName: "Explorador de Talentos",
    medalIcon: "🎯",
    medalDescription: "Descubriste el propósito que mueve tu emprendimiento.",
  },
  {
    id: "modulo-3",
    title: "Módulo 3 · Fundamentos de emprendimiento y administración",
    summary: "Domina los fundamentos para organizar y gestionar un negocio.",
    medalName: "Guardián del Negocio",
    medalIcon: "⚙️",
    medalDescription: "Asentaste las bases administrativas de tu negocio.",
  },
  {
    id: "modulo-final",
    title: "Módulo 4 · Innovación y comercialización",
    summary: "Transforma ideas en productos y estrategias de mercado.",
    medalName: "Estrella de Ventas",
    medalIcon: "💡",
    medalDescription: "Innovaste y preparaste tu propuesta para el mercado.",
  },
  {
    id: "modulo-5",
    title: "Módulo 5 · Sostenibilidad",
    summary: "Diseña un modelo de negocio responsable y sostenible en el tiempo.",
    medalName: "Ojo de Águila",
    medalIcon: "🌱",
    medalDescription: "Desarrollaste una visión sostenible para tu negocio.",
  },
  {
    id: "modulo-6",
    title: "Módulo 6 · Gestión y formalización",
    summary: "Aprende a gestionar procesos y dar formalidad a tu organización.",
    medalName: "Arquitecto de Negocios",
    medalIcon: "📋",
    medalDescription: "Construiste la estructura formal de tu negocio.",
  },
  {
    id: "modulo-7",
    title: "Módulo 7 · Vinculación y formalización legal",
    summary: "Conecta con aliados y cumple los requisitos legales para crecer.",
    medalName: "Buscador de Oportunidades",
    medalIcon: "🤝",
    medalDescription: "Cerraste el programa listo para vincularte y formalizar tu negocio.",
  },
];

export type Exercise = { a: number; b: number };

export const EXERCISES: Record<ModuleId, Exercise[]> = {
  "modulo-1": [{ a: 2, b: 3 }],
  "modulo-2": [{ a: 4, b: 5 }],
  "modulo-3": [{ a: 6, b: 2 }],
  "modulo-final": [{ a: 3, b: 4 }],
  "modulo-5": [{ a: 5, b: 3 }],
  "modulo-6": [{ a: 7, b: 2 }],
  "modulo-7": [{ a: 4, b: 4 }],
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
