'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ReadmeData } from '@/types';

interface TagsSectionProps {
  data: ReadmeData;
}

export default function TagsSection({ data }: TagsSectionProps) {
  // 收集所有标签
  const allTags = [
    ...data.basic.keywords,
    ...data.basic.values,
    ...data.basic.tags,
    ...data.life.habits,
    ...data.work.work_preferences,
    ...data.development.skills.tech_stack,
    ...data.development.skills.expertise,
  ];

  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());

  const toggleTag = (tag: string) => {
    const newActiveTags = new Set(activeTags);
    if (newActiveTags.has(tag)) {
      newActiveTags.delete(tag);
    } else {
      newActiveTags.add(tag);
    }
    setActiveTags(newActiveTags);
  };

  return (
    <section id="tags" className="min-h-screen flex items-center justify-center py-8 px-4">
      <div className="max-w-7xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-4 text-center"
        >
          标签墙
        </motion.h2>
        <p className="text-center text-sm text-gray-500 mb-8">点亮标签表示你与缨缨观点同频</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {allTags.map((tag, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 20, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.02 }}
              onClick={() => toggleTag(tag)}
              className={`flex flex-col justify-between rounded-xl border px-3 py-2 text-left text-sm transition-all ${
                activeTags.has(tag)
                  ? 'border-purple-400 bg-gradient-to-br from-purple-500/30 to-pink-500/20 text-white shadow-lg shadow-purple-300/40'
                  : 'border-white/40 bg-white/40 backdrop-blur text-gray-700 hover:border-purple-200 hover:shadow-lg'
              }`}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="text-[10px] uppercase tracking-wide text-gray-400">
                Tag {String(idx + 1).padStart(2, '0')}
              </span>
              <p className="font-semibold leading-tight truncate">{tag}</p>
              {activeTags.has(tag) && (
                <span className="text-xs text-purple-200">已点亮</span>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
