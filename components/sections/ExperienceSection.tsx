'use client';

import { motion } from 'framer-motion';
import { ReadmeData } from '@/types';
import GlassCard from '../GlassCard';

interface ExperienceSectionProps {
  data: ReadmeData['experience'];
}

export default function ExperienceSection({ data }: ExperienceSectionProps) {
  return (
    <section id="experience" className="min-h-screen flex items-center justify-center py-8 px-4">
      <div className="max-w-6xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-12 text-center"
        >
          经历
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.experience.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <GlassCard>
                <div className="text-xs uppercase tracking-[0.4em] text-gray-400 mb-1">{exp.city}</div>
                <div className="text-sm text-gray-500 mb-4">{exp.date}</div>
                <div className="h-32 rounded-2xl border border-dashed border-white/40 bg-white/5" />
                <p className="mt-4 text-gray-700 dark:text-gray-300">{exp.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
