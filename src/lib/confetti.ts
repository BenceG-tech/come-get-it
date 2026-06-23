import confetti from "canvas-confetti";

/** Cyan/electric színű mikro-ünneplés. */
export function celebrate(intensity: "small" | "big" = "small") {
  const colors = ["#00bcd4", "#00d4ff", "#67e8f9", "#ffffff"];
  if (intensity === "big") {
    confetti({ particleCount: 140, spread: 90, origin: { y: 0.7 }, colors });
    setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors }), 150);
    setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors }), 300);
  } else {
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.75 }, colors });
  }
}
