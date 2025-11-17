'use client';

import { motion } from 'framer-motion';
import { ReadmeData } from '@/types';
import GlassCard from '../GlassCard';

interface BasicSectionProps {
  data: ReadmeData['basic'];
}

export default function BasicSection({ data }: BasicSectionProps) {
  return (
    <section id="basic" className="py-24 px-4">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white to-teal-500 bg-clip-text text-transparent">
            {data.name}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">{data.intro}</p>
          <p className="text-lg text-gray-500 dark:text-gray-500">{data.current_status}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassCard>
            <h3 className="font-semibold mb-3">关键词</h3>
            <div className="flex flex-wrap gap-2">
              {data.keywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white/20 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold mb-3">价值观</h3>
            <div className="flex flex-wrap gap-2">
              {data.values.map((value, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white/20 rounded-full text-sm"
                >
                  {value}
                </span>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold mb-3">标签</h3>
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white/20 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
