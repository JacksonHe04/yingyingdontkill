'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { scrollToElement } from '@/lib/utils';

const sections = [
  { id: 'basic', label: '基础' },
  { id: 'life', label: '生活' },
  { id: 'experience', label: '经历' },
  { id: 'education', label: '教育' },
  { id: 'work', label: '工作' },
  { id: 'development', label: '开发' },
  { id: 'products', label: '产品' },
  { id: 'reading', label: '读书' },
  { id: 'films', label: '影片' },
  { id: 'creation', label: '创作' },
  { id: 'music', label: '音乐' },
  { id: 'hiphop', label: '嘻哈' },
  { id: 'events', label: '活动' },
  { id: 'tags', label: '标签' },
  { id: 'contact', label: '联系' },
  { id: 'message', label: '留言' },
];

export default function SideNav() {
  const [activeSection, setActiveSection] = useState('basic');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      className="fixed left-2 lg:left-4 top-1/2 -translate-y-1/2 z-40 hidden md:block"
    >
      <div className="backdrop-blur-md bg-white/10 dark:bg-black/10 rounded-2xl p-4 border border-white/20">
        <div className="flex flex-col gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToElement(section.id)}
              className={`relative px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm transition-colors ${
                activeSection === section.id
                  ? 'bg-white/20 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/10'
              }`}
            >
              {section.label}
              {activeSection === section.id && (
                <motion.div
                  layoutId="activeSection"
                  className="absolute inset-0 bg-white/20 rounded-lg"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}

