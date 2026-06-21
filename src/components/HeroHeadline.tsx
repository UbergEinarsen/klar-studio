import { motion, useReducedMotion } from "motion/react";

const words = ["Klar,", "ferdig", "— på nett."];

export default function HeroHeadline() {
  const reduce = useReducedMotion();
  return (
    <h1 style={{ fontSize: "var(--step-5)", margin: 0 }}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block", marginRight: "0.25em" }}
          initial={reduce ? false : { y: "0.6em", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {w}
        </motion.span>
      ))}
    </h1>
  );
}
