'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReadmeData } from '@/types';
import GlassCard from '../GlassCard';
import ProductDeskScene from '../scenes/ProductDeskScene';

interface ProductsSectionProps {
  data: ReadmeData['products'];
}

type ProductDetail = {
  title: string;
  description: string;
  tags?: string[];
  link?: string;
};

export default function ProductsSection({ data }: ProductsSectionProps) {
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(null);

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

        <ProductDeskScene
          favoriteProducts={data.favorite_products}
          recommendedProducts={data.recommended_products}
          hardware={data.my_hardware}
          activeTitle={selectedProduct?.title ?? null}
          onSelect={setSelectedProduct}
        />

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
                  onClick={() =>
                    setSelectedProduct({
                      title: product.name,
                      description: product.intro,
                      tags: product.tags,
                      link: product.link,
                    })
                  }
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
                  onClick={() =>
                    setSelectedProduct({
                      title: product.name,
                      description: product.intro,
                      tags: product.tags,
                      link: product.link,
                    })
                  }
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
                <h3 className="text-2xl font-bold mb-2">{selectedProduct.title}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {selectedProduct.tags?.join(' · ')}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{selectedProduct.description}</p>
                {selectedProduct.link && (
                  <a
                    href={selectedProduct.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    打开链接 →
                  </a>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
