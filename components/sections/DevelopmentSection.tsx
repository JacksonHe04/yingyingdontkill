'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ReadmeData } from '@/types';
import GlassCard from '../GlassCard';

interface DevelopmentSectionProps {
  data: ReadmeData['development'];
}

export default function DevelopmentSection({ data }: DevelopmentSectionProps) {
  // 不规则布局：8个围绕1个
  const projects = data.projects;
  const centerProject = projects[0];
  const surroundingProjects = projects.slice(1);
  const [useDesktopLayout, setUseDesktopLayout] = useState(false);

  useEffect(() => {
    const handleResize = () => setUseDesktopLayout(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section id="development" className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="max-w-7xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-12 text-center"
        >
          开发
        </motion.h2>

        {/* 技能 */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard>
            <h3 className="font-semibold mb-4">技术栈</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.tech_stack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-500/20 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </GlassCard>
          <GlassCard>
            <h3 className="font-semibold mb-4">专长</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.expertise.map((exp, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-purple-500/20 rounded-full text-sm"
                >
                  {exp}
                </span>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* 项目 - 不规则布局 */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* 周围8个项目 */}
            {surroundingProjects.slice(0, 8).map((project, idx) => {
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
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  style={useDesktopLayout ? { gridRow: pos.row, gridColumn: pos.col } : undefined}
                >
                  <div className="flex flex-col md:flex-row gap-4 md:items-stretch">
                    <div className="rounded-2xl border border-white/20 bg-white/5 flex items-center justify-center text-xs text-white/50 h-32 md:h-auto md:min-h-[8rem] md:w-40">
                      预留封面
                    </div>
                    <GlassCard className="flex-1">
                      <h4 className="font-semibold mb-2">{project.project_name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.tech_stack.slice(0, 2).map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white/10 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-3 text-xs text-blue-400">
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            GitHub
                          </a>
                        )}
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            访问
                          </a>
                        )}
                      </div>
                    </GlassCard>
                  </div>
                </motion.div>
              );
            })}
            {/* 中心项目 */}
            {centerProject && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                style={useDesktopLayout ? { gridRow: 2, gridColumn: 2 } : undefined}
                className="z-10"
              >
                <div className="flex flex-col md:flex-row gap-4 md:items-stretch">
                  <div className="rounded-2xl border border-white/30 bg-white/10 flex items-center justify-center text-sm text-white/60 h-36 md:h-auto md:min-h-[10rem] md:w-48">
                    预留封面
                  </div>
                  <GlassCard className="flex-1 bg-gradient-to-br from-purple-500/30 to-pink-500/30">
                    <h4 className="font-bold text-lg mb-2">{centerProject.project_name}</h4>
                    <p className="text-sm mb-3">{centerProject.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {centerProject.tech_stack.map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white/20 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3 text-sm text-white">
                      {centerProject.github && (
                        <a href={centerProject.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          GitHub
                        </a>
                      )}
                      {centerProject.link && (
                        <a href={centerProject.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          访问
                        </a>
                      )}
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* 开发工具 */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-6">开发工具</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.dev_tools.map((tool, idx) => (
              <GlassCard key={idx}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{tool.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {tool.comment}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {tool.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-white/10 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <a
                    href={tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 text-blue-400 hover:underline"
                  >
                    访问 →
                  </a>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
