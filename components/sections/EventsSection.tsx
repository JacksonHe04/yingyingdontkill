'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ReadmeData } from '@/types';
import GlassCard from '../GlassCard';

interface EventsSectionProps {
  data: ReadmeData['events'];
}

export default function EventsSection({ data }: EventsSectionProps) {
  const performances = data.performances;
  const centerPerformance = performances[0];
  const surroundingPerformances = performances.slice(1);
  const [useDesktopLayout, setUseDesktopLayout] = useState(false);

  useEffect(() => {
    const handleResize = () => setUseDesktopLayout(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section id="events" className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="max-w-7xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-12 text-center"
        >
          活动
        </motion.h2>

        {/* 不规则布局：8个围绕1个 */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* 周围8个活动 */}
            {surroundingPerformances.slice(0, 8).map((performance, idx) => {
              const positions = [
                { row: 1, col: 1 },
                { row: 1, col: 2 },
                { row: 1, col: 3 },
                { row: 2, col: 1 },
                { row: 2, col: 3 },
                { row: 3, col: 1 },
                { row: 3, col: 2 },
                { row: 3, col: 3 },
              ];
              const pos = positions[idx] || { row: 1, col: 1 };
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  style={useDesktopLayout ? { gridRow: pos.row, gridColumn: pos.col } : undefined}
                  className="flex flex-col"
                >
                  <div className="h-28 rounded-2xl border border-white/20 bg-white/5 mb-3 flex items-center justify-center text-xs text-white/50">
                    活动海报预留
                  </div>
                  <GlassCard className="-mt-4 pt-8">
                    <div className="text-xs text-gray-500 mb-1">{performance.type}</div>
                    <h4 className="font-semibold mb-2">{performance.name}</h4>
                    <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <div>{performance.date}</div>
                      <div>{performance.genre}</div>
                      <div>{performance.location}</div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
            {/* 中心活动 */}
            {centerPerformance && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                style={useDesktopLayout ? { gridRow: 2, gridColumn: 2 } : undefined}
                className="z-10"
              >
                <div className="flex flex-col">
                  <div className="h-32 rounded-2xl border border-white/30 bg-white/10 mb-3 flex items-center justify-center text-sm text-white/70">
                    活动海报预留
                  </div>
                  <GlassCard className="-mt-6 bg-gradient-to-br from-purple-500/30 to-pink-500/30 pt-10">
                    <div className="text-sm text-white/80 mb-2">{centerPerformance.type}</div>
                    <h4 className="font-bold text-lg mb-3">{centerPerformance.name}</h4>
                    <div className="text-sm text-white/90 space-y-1">
                      <div>{centerPerformance.date}</div>
                      <div>{centerPerformance.genre}</div>
                      <div>{centerPerformance.location}</div>
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
