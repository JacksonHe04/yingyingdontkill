'use client';

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
          <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
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
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  style={{ gridRow: pos.row, gridColumn: pos.col }}
                >
                  <GlassCard>
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
                style={{ gridRow: 2, gridColumn: 2 }}
                className="z-10"
              >
                <GlassCard className="bg-gradient-to-br from-purple-500/30 to-pink-500/30">
                  <div className="text-sm text-white/80 mb-2">{centerPerformance.type}</div>
                  <h4 className="font-bold text-lg mb-3">{centerPerformance.name}</h4>
                  <div className="text-sm text-white/90 space-y-1">
                    <div>{centerPerformance.date}</div>
                    <div>{centerPerformance.genre}</div>
                    <div>{centerPerformance.location}</div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

