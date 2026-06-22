import { motion, useReducedMotion } from "motion/react";

const words = ["Klar,", "ferdig", "— på nett."];

export default function HeroHeadline() {
  const reduce = useReducedMotion();
  return (
    <h1 className="display" style={{ fontSize: "var(--step-6)", margin: 0, color: "#fff", maxWidth: "16ch" }}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          style={{
            display: "inline-block",
            marginRight: "0.22em",
            ...(i === words.length - 1 ? { color: "var(--accent-bright)" } : {}),
          }}
          initial={reduce ? false : { y: "0.7em", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 + i * 0.11, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {i < words.length - 1 ? w + " " : w}
        </motion.span>
      ))}
    </h1>
  );
}
