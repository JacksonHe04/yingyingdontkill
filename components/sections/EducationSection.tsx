'use client';

import { motion } from 'framer-motion';
import { ReadmeData } from '@/types';
import GlassCard from '../GlassCard';
import EducationScene from '../scenes/EducationScene';

interface EducationSectionProps {
  data: ReadmeData['education'];
}

export default function EducationSection({ data }: EducationSectionProps) {
  return (
    <section id="education" className="min-h-screen flex items-center justify-center py-8 px-4">
      <div className="max-w-6xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-12 text-center"
        >
          教育
        </motion.h2>

        <div className="relative">
          <EducationScene schools={data.schools} />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.schools.map((school, idx) => (
              <GlassCard key={idx}>
                <h3 className="font-bold text-xl mb-2">{school.institution}</h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <div>{school.degree} - {school.major}</div>
                  <div>{school.start_date} - {school.end_date}</div>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="mt-6 flex gap-4">
            <GlassCard>
              <div className="text-sm">
                <span className="text-gray-500">本科专业：</span>
                <span className="ml-2">{data.undergraduate_major}</span>
              </div>
            </GlassCard>
            <GlassCard>
              <div className="text-sm">
                <span className="text-gray-500">本科导师：</span>
                <span className="ml-2">{data.undergraduate_advisor}</span>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
