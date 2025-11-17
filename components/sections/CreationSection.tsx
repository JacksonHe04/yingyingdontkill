'use client';

import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ReadmeData } from '@/types';
import GlassCard from '../GlassCard';
import CreationGalaxy from '../scenes/CreationGalaxy';

interface CreationSectionProps {
  data: ReadmeData['creation'];
}

const categoryOrder = [
  { id: 'videos', label: '视频' },
  { id: 'articles', label: '文章' },
  { id: 'speeches', label: '演讲' },
  { id: 'mottos', label: '座右铭' },
  { id: 'quotes', label: '语录' },
];

export default function CreationSection({ data }: CreationSectionProps) {
  const [activeCategory, setActiveCategory] = useState(categoryOrder[0].id);

  return (
    <section id="creation" className="min-h-screen flex items-center justify-center py-8 px-4">
      <div className="max-w-7xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-12 text-center"
        >
          创作
        </motion.h2>

        <div className="mb-12">
          <CreationGalaxy
            activeCategory={activeCategory}
            categories={categoryOrder}
            onChange={setActiveCategory}
          />
        </div>

        <div>{renderCategoryContent(activeCategory, data)}</div>
      </div>
    </section>
  );
}

function renderCategoryContent(activeCategory: string, data: ReadmeData['creation']) {
  switch (activeCategory) {
    case 'videos':
      return (
        <ContentBlock title="视频" description="数字生活、创作笔记等系列内容。">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.videos.map((video) => (
              <GlassCard key={video.title} hover>
                <div className="text-sm text-gray-500 mb-2">{video.series}</div>
                <h4 className="font-semibold mb-2">{video.title}</h4>
                <div className="flex gap-2">
                  {video.video_link && (
                    <a
                      href={video.video_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:underline"
                    >
                      视频 →
                    </a>
                  )}
                  {video.podcast_link && (
                    <a
                      href={video.podcast_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:underline"
                    >
                      播客 →
                    </a>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        </ContentBlock>
      );
    case 'articles':
      return (
        <ContentBlock title="文章" description="沉淀思考的长文。">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.articles.map((article) => (
              <GlassCard key={article.title} hover>
                <h4 className="font-semibold mb-2">{article.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{article.excerpt}</p>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:underline"
                >
                  阅读全文 →
                </a>
              </GlassCard>
            ))}
          </div>
        </ContentBlock>
      );
    case 'speeches':
      return (
        <ContentBlock title="演讲" description="公开分享与主题演讲。">
          <div className="grid grid-cols-1 gap-4">
            {data.speeches.map((speech) => (
              <GlassCard key={speech.speech_name} hover>
                <h4 className="font-semibold mb-2">{speech.speech_name}</h4>
                <div className="flex flex-wrap gap-2">
                  {speech.link && (
                    <a
                      href={speech.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:underline"
                    >
                      演示文稿 →
                    </a>
                  )}
                  {speech.outline_doc && (
                    <a
                      href={speech.outline_doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:underline"
                    >
                      大纲文档 →
                    </a>
                  )}
                  {speech.presentation_link && (
                    <a
                      href={speech.presentation_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:underline"
                    >
                      讲稿 →
                    </a>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        </ContentBlock>
      );
    case 'mottos':
      return (
        <ContentBlock title="座右铭" description="驱动创作的信念。">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.mottos.map((motto) => (
              <GlassCard key={motto}>
                <p className="text-center text-lg italic">{motto}</p>
              </GlassCard>
            ))}
          </div>
        </ContentBlock>
      );
    case 'quotes':
      return (
        <ContentBlock title="语录" description="日常灵感摘录。">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.quotes.map((quote) => (
              <GlassCard key={quote}>
                <p className="text-center text-lg italic">{quote}</p>
              </GlassCard>
            ))}
          </div>
        </ContentBlock>
      );
    default:
      return null;
  }
}

function ContentBlock({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      {children}
    </div>
  );
}
