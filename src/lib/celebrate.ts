import confetti from "canvas-confetti";

const COLORS = ["#FFD35C", "#F5A524", "#FFF1C9", "#E2872A"];

/** Lluvia de confeti central. */
export function burstConfetti(origin: { x?: number; y?: number } = { y: 0.6 }) {
  confetti({
    particleCount: 140,
    spread: 100,
    origin,
    colors: COLORS,
    disableForReducedMotion: true,
  });
}

/** Confeti pequeño desde un elemento (al tocar una medalla). */
export function burstFromElement(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  burstConfetti({
    x: (rect.left + rect.width / 2) / window.innerWidth,
    y: (rect.top + rect.height / 2) / window.innerHeight,
  });
}

/** Chorros laterales durante ~1.4s. */
export function sideCannons() {
  const end = Date.now() + 1400;
  let id = 0;
  const frame = () => {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.7 },
      colors: COLORS,
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.7 },
      colors: COLORS,
      disableForReducedMotion: true,
    });
    if (Date.now() < end) id = requestAnimationFrame(frame);
  };
  id = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(id);
}
