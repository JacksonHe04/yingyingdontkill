'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ReadmeData } from '@/types';
import GlassCard from '../GlassCard';
import DeepSpaceScene from '../scenes/DeepSpaceScene';

interface DeepWaterSectionProps {
  data: ReadmeData['thoughts'];
}

export default function DeepWaterSection({ data }: DeepWaterSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY + window.innerHeight;
      // 当滚动到底部并继续下拉一定距离时显示
      if (scrollTop >= scrollHeight - 100) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <section id="deepwater" className="min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-black" />

      <div className="max-w-6xl w-full relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold mb-12 text-center text-white"
        >
          深水区
        </motion.h2>

        <div className="mb-12">
          <DeepSpaceScene />
        </div>

        {/* 思想观点 */}
        <div className="space-y-6">
          <GlassCard className="bg-white/5 backdrop-blur-md">
            <h3 className="text-2xl font-semibold mb-4 text-white">个人哲学</h3>
            <div className="space-y-2">
              {data.personal_philosophy.map((philosophy, idx) => (
                <p key={idx} className="text-gray-200">{philosophy}</p>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="bg-white/5 backdrop-blur-md">
            <h3 className="text-2xl font-semibold mb-4 text-white">行业观点</h3>
            <div className="space-y-2">
              {data.industry_views.map((view, idx) => (
                <p key={idx} className="text-gray-200">{view}</p>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="bg-white/5 backdrop-blur-md">
            <h3 className="text-2xl font-semibold mb-4 text-white">意识形态</h3>
            <div className="space-y-2">
              {data.ideology.map((ideology, idx) => (
                <p key={idx} className="text-gray-200">{ideology}</p>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="bg-white/5 backdrop-blur-md">
            <h3 className="text-2xl font-semibold mb-4 text-white">生命元素</h3>
            <div className="flex flex-wrap gap-2">
              {data.life_elements.map((element, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-white/20 rounded-full text-sm text-white"
                >
                  {element}
                </span>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="bg-white/5 backdrop-blur-md">
            <h3 className="text-2xl font-semibold mb-4 text-white">宏观愿景</h3>
            <div className="space-y-2">
              {data.macro_vision.map((vision, idx) => (
                <p key={idx} className="text-gray-200">{vision}</p>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="bg-white/5 backdrop-blur-md">
            <h3 className="text-2xl font-semibold mb-4 text-white">个人愿景</h3>
            <div className="space-y-2">
              {data.personal_vision.map((vision, idx) => (
                <p key={idx} className="text-gray-200">{vision}</p>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="bg-white/5 backdrop-blur-md">
            <h3 className="text-2xl font-semibold mb-4 text-white">问答</h3>
            <div className="space-y-4">
              {data.qa.map((qa, idx) => (
                <div key={idx} className="border-b border-white/20 pb-4 last:border-0">
                  <h4 className="font-semibold text-white mb-2">{qa.question}</h4>
                  <p className="text-gray-200 mb-2">{qa.answer}</p>
                  <div className="text-xs text-gray-400">
                    {qa.source} · {qa.date}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
