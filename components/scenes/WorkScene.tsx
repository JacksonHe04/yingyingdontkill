'use client';

import { motion } from 'framer-motion';
import type { ReadmeData } from '@/types';

interface WorkSceneProps {
  jobs: ReadmeData['work']['jobs'];
}

export default function WorkScene({ jobs }: WorkSceneProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 p-6 text-white shadow-inner shadow-emerald-900/50">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle,_rgba(16,185,129,0.2)_0%,_transparent_45%)]"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,185,129,0.15)_0%,transparent_40%,rgba(6,182,212,0.2)_70%,transparent_100%)]"
          animate={{ backgroundPositionX: ['0%', '120%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative z-10 space-y-3">
        <p className="text-sm uppercase tracking-[0.4em] text-emerald-100/70">Career Arcade</p>
        <h3 className="text-2xl font-semibold">2D 工作闯关 · 项目任务场景</h3>
        <p className="text-sm text-emerald-50/80">
          每一段履历是一张任务卡，解锁技能与产出。
        </p>
      </div>

  <div className="relative mt-8 h-64">
        <div className="absolute inset-0 rounded-3xl border border-white/10" />

        {/* scrolling grid */}
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08)_8%,transparent_30%,rgba(255,255,255,0.08)_60%,transparent_85%)]"
          animate={{ backgroundPositionX: ['0%', '200%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />

        <div className="relative flex h-full items-end justify-between gap-4 px-6">
          {jobs.map((job, idx) => (
            <motion.div
              key={`${job.company_name}-${idx}`}
              className="relative flex w-full max-w-xs flex-col items-center"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12 }}
            >
              <motion.div
                className="relative mb-4 h-24 w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 p-4 shadow-[0_15px_35px_rgba(6,182,212,0.35)]"
                whileHover={{ translateY: -6 }}
              >
                <p className="text-xs uppercase tracking-widest text-emerald-50/70">
                  {job.start_date} ~ {job.end_date}
                </p>
                <p className="mt-2 text-lg font-semibold">{job.company_name || '未公开'}</p>
                <p className="text-sm text-emerald-50/90">
                  {job.position} · {job.position_type}
                </p>
              </motion.div>
              <div className="w-2 rounded-full bg-gradient-to-b from-emerald-300 to-emerald-500 py-6" />
              <div className="mt-2 w-full rounded-xl bg-white/5 p-3 text-sm text-emerald-50/80">
                <p className="font-semibold text-emerald-50">任务：{job.products_responsible_for || '创意探索'}</p>
                <p className="mt-1 line-clamp-2 text-xs">{job.job_summary || '待补充内容'}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* hoverable player */}
        <motion.div
          className="absolute bottom-6 left-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-400 text-2xl shadow-xl shadow-orange-500/50"
          animate={{ x: ['0%', '75%'], y: [0, -6, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        >
          🚀
        </motion.div>
      </div>
    </div>
  );
}

