'use client';

import { motion } from 'framer-motion';
import { ReadmeData } from '@/types';
import GlassCard from '../GlassCard';

interface ContactSectionProps {
  data: ReadmeData['contact'];
}

export default function ContactSection({ data }: ContactSectionProps) {
  const platformIcons: Record<string, string> = {
    GitHub: '⚡',
    Twitter: '🐦',
  };

  return (
    <section id="contact" className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="max-w-4xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-12 text-center"
        >
          联系
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 联系方式 */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">联系方式</h3>
            <div className="space-y-4">
              {data.contact_info.map((info, idx) => (
                <GlassCard key={idx} hover>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold mb-1">{info.method_name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {info.content}
                      </div>
                    </div>
                    {info.method_name === '邮箱' && (
                      <a
                        href={`mailto:${info.content}`}
                        className="text-blue-400 hover:underline"
                      >
                        发送 →
                      </a>
                    )}
                    {info.method_name === '个人网站' && (
                      <a
                        href={info.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        访问 →
                      </a>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* 平台账号 */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">平台账号</h3>
            <div className="space-y-4">
              {data.platform_accounts.map((platform, idx) => (
                <GlassCard key={idx} hover>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {platformIcons[platform.platform_name] || '🔗'}
                      </span>
                      <div>
                        <div className="font-semibold">{platform.platform_name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {platform.username}
                        </div>
                      </div>
                    </div>
                    <a
                      href={platform.homepage_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      访问 →
                    </a>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

