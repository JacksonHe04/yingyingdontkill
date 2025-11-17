'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { ReadmeData } from '@/types';

interface EducationSceneProps {
  schools: ReadmeData['education']['schools'];
}

export default function EducationScene({ schools }: EducationSceneProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const updateMatch = () => setIsMobile(mediaQuery.matches);
    updateMatch();
    mediaQuery.addEventListener('change', updateMatch);
    return () => mediaQuery.removeEventListener('change', updateMatch);
  }, []);

  return (
    <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-sky-900 via-indigo-900 to-purple-900 p-6 text-white shadow-inner shadow-blue-900/40">
      {/* stars */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2)_0%,_transparent_45%)]"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.1)_10%,transparent_35%,rgba(255,255,255,0.12)_60%,transparent_85%)]"
          animate={{ backgroundPositionX: ['0%', '50%'] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative z-10 space-y-4">
        <p className="text-sm uppercase tracking-[0.5em] text-blue-100">Learning Journey</p>
        <h3 className="text-2xl font-semibold">2D 横屏学习冒险 · 教育地图</h3>
        <p className="text-sm text-blue-100/80">
          以游戏场景呈现学业阶段，让课程像闯关一样清晰。
        </p>
      </div>

      <div className={`relative mt-10 ${isMobile ? 'space-y-6' : 'h-64'}`}>
        {!isMobile && (
          <motion.div
            className="absolute inset-x-0 bottom-24 h-24 bg-gradient-to-t from-indigo-800/80 to-transparent"
            animate={{ backgroundPositionX: ['0%', '100%'] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          />
        )}

        <div
          className={`relative ${
            isMobile
              ? 'flex flex-col gap-4'
              : 'flex h-full items-end justify-between gap-6 flex-row-reverse'
          }`}
        >
          {schools.map((school, idx) => {
            const levelNumber = schools.length - idx;
            return (
              <motion.div
                key={school.institution}
                className={isMobile ? 'rounded-2xl border border-white/20 bg-white/5 p-4 space-y-2' : 'relative flex-1'}
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                {isMobile ? (
                  <>
                    <p className="text-xs uppercase tracking-[0.4em] text-blue-100/60">
                      Level {levelNumber}
                    </p>
                    <p className="text-lg font-semibold">{school.institution}</p>
                    <p className="text-sm text-blue-100/80">
                      {school.degree} · {school.major}
                    </p>
                    <p className="text-xs text-blue-100/60">
                      {school.start_date} ~ {school.end_date}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="absolute -top-28 left-1/2 w-44 -translate-x-1/2 text-center">
                      <p className="text-xs uppercase tracking-widest text-blue-100/70">
                        {school.start_date} ~ {school.end_date}
                      </p>
                      <p className="mt-1 text-lg font-semibold">{school.institution}</p>
                      <p className="text-sm text-blue-100/80">
                        {school.degree} · {school.major}
                      </p>
                    </div>
                    <div className="h-20 rounded-2xl bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 shadow-[0_15px_40px_rgba(15,23,42,0.45)]">
                      <div className="flex h-full items-center justify-center text-sm font-semibold uppercase tracking-widest text-white/80">
                        Level {levelNumber}
                      </div>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/20" />
                  </>
                )}
              </motion.div>
            );
          })}
        </div>

        {!isMobile && (
          <>
            <motion.div
              className="absolute bottom-24 left-6 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 shadow-lg shadow-yellow-500/50 ring-4 ring-white/20"
              animate={{ x: ['70%', '-10%'], rotate: [0, 3, -3, 0] }}
              transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
            >
              🎓
            </motion.div>
            <div className="absolute bottom-14 left-0 right-0 h-8 bg-gradient-to-b from-white/15 to-white/0 blur-3xl" />
            <div className="absolute bottom-10 left-6 right-6 h-1 rounded-full bg-gradient-to-r from-blue-200 via-violet-200 to-pink-200 opacity-70" />
          </>
        )}
      </div>
    </div>
  );
}
