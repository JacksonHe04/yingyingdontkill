'use client';

import { useState, useEffect } from 'react';
import { motion, type PanInfo } from 'framer-motion';
import { ReadmeData } from '@/types';
import GlassCard from '../GlassCard';
import DeepSpaceScene from '../scenes/DeepSpaceScene';

interface DeepWaterSectionProps {
  data: ReadmeData['thoughts'];
}

export default function DeepWaterSection({ data }: DeepWaterSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY + window.innerHeight;
      if (scrollTop >= scrollHeight - 120) {
        setIsVisible(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('deepwater-visibility', { detail: { active: isUnlocked } })
    );
    return () => {
      window.dispatchEvent(
        new CustomEvent('deepwater-visibility', { detail: { active: false } })
      );
    };
  }, [isUnlocked]);

  if (!isVisible) return null;

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100) {
      setIsUnlocked(true);
      setPullProgress(1);
    } else {
      setPullProgress(0);
    }
  };

  return (
    <section id="deepwater" className="min-h-screen w-full py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-black" />

      <div className="relative z-10 space-y-10">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-center text-white"
        >
          深水区
        </motion.h2>

        {!isUnlocked ? (
          <div className="flex flex-col items-center gap-6 text-white">
            <p className="text-sm text-white/70">向下拖拽把手，感受进入未知的阻力</p>
            <motion.div
              className="w-full max-w-sm rounded-full border border-white/30 bg-white/10 p-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div
                className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-teal-400"
                style={{ width: `${pullProgress * 100}%` }}
              />
            </motion.div>
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 160 }}
              onDrag={(_, info) => setPullProgress(Math.min(1, info.offset.y / 140))}
              onDragEnd={handleDragEnd}
              className="w-32 rounded-full border border-white/40 bg-white/20 text-center py-3 text-sm font-semibold cursor-grab"
            >
              下拉潜水
            </motion.div>
          </div>
        ) : (
          <>
            <DeepSpaceScene />
            <div className="w-full space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard className="bg-white/5 backdrop-blur-md">
                  <h3 className="text-2xl font-semibold mb-4 text-white">个人哲学</h3>
                  <div className="space-y-2">
                    {data.personal_philosophy.map((philosophy, idx) => (
                      <p key={idx} className="text-gray-200">
                        {philosophy}
                      </p>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="bg-white/5 backdrop-blur-md">
                  <h3 className="text-2xl font-semibold mb-4 text-white">行业观点</h3>
                  <div className="space-y-2">
                    {data.industry_views.map((view, idx) => (
                      <p key={idx} className="text-gray-200">
                        {view}
                      </p>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="bg-white/5 backdrop-blur-md">
                  <h3 className="text-2xl font-semibold mb-4 text-white">意识形态</h3>
                  <div className="space-y-2">
                    {data.ideology.map((ideology, idx) => (
                      <p key={idx} className="text-gray-200">
                        {ideology}
                      </p>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="bg-white/5 backdrop-blur-md">
                  <h3 className="text-2xl font-semibold mb-4 text-white">生命元素</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.life_elements.map((element, idx) => (
                      <span key={idx} className="px-4 py-2 bg-white/20 rounded-full text-sm text-white">
                        {element}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard className="bg-white/5 backdrop-blur-md">
                  <h3 className="text-2xl font-semibold mb-4 text-white">宏观愿景</h3>
                  <div className="space-y-2">
                    {data.macro_vision.map((vision, idx) => (
                      <p key={idx} className="text-gray-200">
                        {vision}
                      </p>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="bg-white/5 backdrop-blur-md">
                  <h3 className="text-2xl font-semibold mb-4 text-white">个人愿景</h3>
                  <div className="space-y-2">
                    {data.personal_vision.map((vision, idx) => (
                      <p key={idx} className="text-gray-200">
                        {vision}
                      </p>
                    ))}
                  </div>
                </GlassCard>
              </div>

              <GlassCard className="bg-white/5 backdrop-blur-md">
                <h3 className="text-2xl font-semibold mb-4 text-white">问答</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {data.qa.map((qa, idx) => (
                    <div key={idx} className="border-b border-white/20 pb-4 last:border-0 text-white">
                      <h4 className="font-semibold mb-2">{qa.question}</h4>
                      <p className="text-gray-200 mb-2">{qa.answer}</p>
                      <div className="text-xs text-gray-400">
                        {qa.source} · {qa.date}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
