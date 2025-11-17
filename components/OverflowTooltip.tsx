'use client';

import { useState, useRef, useEffect, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

interface OverflowTooltipProps {
  text: string;
  className?: string;
}

export default function OverflowTooltip({ text, className = '' }: OverflowTooltipProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEnter = (event: MouseEvent<HTMLSpanElement>) => {
    if (!spanRef.current) return;
    const isOverflowing = spanRef.current.scrollWidth > spanRef.current.clientWidth;
    if (isOverflowing) {
      setCoords({ x: event.clientX, y: event.clientY });
      setVisible(true);
    }
  };

  const handleMove = (event: MouseEvent<HTMLSpanElement>) => {
    if (visible) {
      setCoords({ x: event.clientX, y: event.clientY });
    }
  };

  const handleLeave = () => setVisible(false);

  return (
    <>
      <span
        ref={spanRef}
        className={className}
        onMouseEnter={handleEnter}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        {text}
      </span>
      {mounted &&
        createPortal(
          <AnimatePresence>
            {visible && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="pointer-events-none fixed z-[60] -translate-x-1/2 rounded-xl border border-white/40 bg-white/70 px-3 py-1 text-xs font-medium text-gray-800 shadow-2xl backdrop-blur-2xl"
                style={{ top: coords.y + 16, left: coords.x }}
              >
                {text}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
