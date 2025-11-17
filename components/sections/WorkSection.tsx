'use client';

import { Fragment, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { ReadmeData } from '@/types';
import WorkScene from '../scenes/WorkScene';
import Modal from '../Modal';

interface WorkSectionProps {
  data: ReadmeData['work'];
}

export default function WorkSection({ data }: WorkSectionProps) {
  const [selectedJob, setSelectedJob] = useState<ReadmeData['work']['jobs'][number] | null>(null);

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
          className="text-xl text-gray-600 dark:text-gray-400 mb-6"
        >
          {data.current_job}
        </motion.p>
        <p className="text-sm text-gray-500 mb-10">
          点击 2D 闯关中的任意公司即可在页面中心查看详细履历。
        </p>

        <div className="relative mb-12">
          <WorkScene jobs={data.jobs} onSelectJob={setSelectedJob} activeJobId={selectedJob?.company_name} />
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">工作偏好</h3>
          <div className="flex flex-wrap items-center gap-2">
            {data.work_preferences.map((pref, idx) => (
              <Fragment key={`${pref}-${idx}`}>
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm">{pref}</span>
                {idx < data.work_preferences.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-white/60" aria-hidden />
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      <Modal open={!!selectedJob} onClose={() => setSelectedJob(null)}>
        {selectedJob && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedJob.company_name}</h3>
                <p className="text-sm text-gray-600">
                  {selectedJob.start_date} - {selectedJob.end_date}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-white text-gray-800 text-xs font-semibold">
                {selectedJob.position_type}
              </span>
            </div>
            <p className="text-lg font-semibold text-gray-800">{selectedJob.position}</p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-800">负责：</span>
              {selectedJob.products_responsible_for}
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">{selectedJob.job_summary}</p>
            <div className="rounded-2xl bg-white/70 p-4 text-sm text-gray-600">
              {selectedJob.work_output}
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
