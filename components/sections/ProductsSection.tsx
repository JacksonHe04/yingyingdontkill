'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReadmeData } from '@/types';
import GlassCard from '../GlassCard';

interface ProductsSectionProps {
  data: ReadmeData['products'];
}

export default function ProductsSection({ data }: ProductsSectionProps) {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  return (
    <section id="products" className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="max-w-7xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-12 text-center"
        >
          产品
        </motion.h2>

        {/* 书桌场景占位 */}
        <div className="mb-12 aspect-video bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl p-8 flex items-center justify-center relative overflow-hidden">
          <div className="text-center text-white z-10">
            <p className="text-2xl mb-4">书桌场景</p>
            <p className="text-sm opacity-80">（待实现3D书桌展示）</p>
          </div>
          {/* 占位符：手机和MacBook */}
          <div className="absolute bottom-8 left-1/4 w-16 h-24 bg-gray-800 rounded-lg border-2 border-gray-600 transform rotate-12" />
          <div className="absolute bottom-8 right-1/4 w-32 h-20 bg-gray-900 rounded-lg border-2 border-gray-700" />
        </div>

        {/* 最爱产品 */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6">最爱产品</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.favorite_products.map((product, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <GlassCard
                  hover
                  className="cursor-pointer"
                  onClick={() => setSelectedProduct(`favorite-${idx}`)}
                >
                  <h4 className="font-semibold mb-2">{product.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {product.intro}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-white/10 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 推荐产品 */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6">推荐产品</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.recommended_products.map((product, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <GlassCard
                  hover
                  className="cursor-pointer"
                  onClick={() => setSelectedProduct(`recommended-${idx}`)}
                >
                  <h4 className="font-semibold mb-2">{product.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {product.intro}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-white/10 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 我的硬件 */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6">我的硬件</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <GlassCard>
              <div className="text-sm">
                <span className="text-gray-500">手机：</span>
                <span className="ml-2">{data.my_hardware.phone}</span>
              </div>
            </GlassCard>
            <GlassCard>
              <div className="text-sm">
                <span className="text-gray-500">电脑：</span>
                <span className="ml-2">{data.my_hardware.computer}</span>
              </div>
            </GlassCard>
            <GlassCard>
              <div className="text-sm">
                <span className="text-gray-500">平板：</span>
                <span className="ml-2">{data.my_hardware.tablet}</span>
              </div>
            </GlassCard>
            <GlassCard>
              <div className="text-sm">
                <span className="text-gray-500">手环：</span>
                <span className="ml-2">{data.my_hardware.smartwatch}</span>
              </div>
            </GlassCard>
            <GlassCard className="md:col-span-2">
              <div className="text-sm">
                <span className="text-gray-500">耳机：</span>
                <span className="ml-2">
                  {data.my_hardware.headphones.join('、')}
                </span>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* 最爱品牌 */}
        <div>
          <h3 className="text-2xl font-semibold mb-6">最爱品牌</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.favorite_brands.map((brand, idx) => (
              <GlassCard key={idx} hover>
                <h4 className="font-semibold mb-2">{brand.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {brand.intro}
                </p>
                <div className="flex flex-wrap gap-2">
                  {brand.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-white/10 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* 产品详情弹窗 */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedProduct(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="float-right text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <h3 className="text-2xl font-bold mb-4">产品详情</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  （产品详情内容）
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

