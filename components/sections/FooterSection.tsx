'use client';

import { useState, useEffect } from 'react';
import GlassCard from '../GlassCard';

export default function FooterSection() {
  const [visitCount, setVisitCount] = useState(0);
  const [uptime, setUptime] = useState('');

  useEffect(() => {
    // 模拟访问次数（实际应该从后端获取）
    setVisitCount(Math.floor(Math.random() * 10000) + 1000);
    
    // 计算运行时长（从某个固定日期开始）
    const startDate = new Date('2024-01-01');
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - startDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    setUptime(`${diffDays} 天`);
  }, []);

  const techStack = ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Three.js', 'Framer Motion'];
  const designConcept = '用创新的交互方式，让信息在视觉美感中自然流动。';

  return (
    <footer className="py-20 px-4 bg-gradient-to-b from-transparent to-gray-100 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlassCard>
            <h3 className="font-semibold mb-2">访问次数</h3>
            <p className="text-2xl font-bold text-blue-500">{visitCount.toLocaleString()}</p>
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold mb-2">网站运行时长</h3>
            <p className="text-2xl font-bold text-green-500">{uptime}</p>
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold mb-2">更新日期</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {new Date().toLocaleDateString('zh-CN')}
            </p>
          </GlassCard>

          <GlassCard className="md:col-span-2">
            <h3 className="font-semibold mb-2">网站技术栈</h3>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white/20 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold mb-2">设计理念</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {designConcept}
            </p>
          </GlassCard>

          <GlassCard className="md:col-span-3">
            <h3 className="font-semibold mb-2">致谢</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              感谢所有支持这个项目的朋友和开源社区。特别感谢 Next.js、React、Three.js 等优秀开源项目的贡献者。
            </p>
          </GlassCard>
        </div>
      </div>
    </footer>
  );
}

