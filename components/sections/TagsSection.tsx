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
    <section id="tags" className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="max-w-7xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-12 text-center"
        >
          标签墙
        </motion.h2>

        <div className="overflow-x-auto">
          <div className="flex flex-wrap gap-3 justify-center min-w-max">
            {allTags.map((tag, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.02 }}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  activeTags.has(tag)
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-110'
                    : 'bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 hover:bg-white/20'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

