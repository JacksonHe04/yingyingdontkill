'use client';

import { motion } from 'framer-motion';
import { ReadmeData } from '@/types';
import GlassCard from '../GlassCard';
import WorkScene from '../scenes/WorkScene';

interface WorkSectionProps {
  data: ReadmeData['work'];
}

export default function WorkSection({ data }: WorkSectionProps) {
  return (
    <section id="work" className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="max-w-6xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-4"
        >
          工作
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xl text-gray-600 dark:text-gray-400 mb-12"
        >
          {data.current_job}
        </motion.p>

        <div className="relative mb-12">
          <WorkScene jobs={data.jobs} />
        </div>

        <div className="space-y-6">
          {data.jobs.map((job, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <GlassCard>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{job.company_name}</h3>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-lg">{job.position}</span>
                      <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                        {job.position_type}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      {job.start_date} - {job.end_date}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      <span className="font-semibold">负责产品：</span>
                      {job.products_responsible_for}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      {job.job_summary}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {job.work_output}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">工作偏好</h3>
          <div className="flex flex-wrap gap-2">
            {data.work_preferences.map((pref, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-white/20 rounded-full text-sm"
              >
                {pref}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
