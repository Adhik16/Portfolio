"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="text-center mb-12">
      <motion.h2
        className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-foreground"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-primary">#</span> {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          className="mt-3 text-muted-foreground max-w-xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {subtitle}
        </motion.p>
      )}
      <div className="mt-4 mx-auto h-1 w-16 rounded-full bg-gradient-to-r from-primary to-primary/30" />
    </div>
  );
}
