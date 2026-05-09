'use client';

import { useState } from 'react';
import type { AdminAsset } from '@/lib/content/admin-data';

type AdminAssetsManagerProps = {
  initialAssets: AdminAsset[];
};

export default function AdminAssetsManager({ initialAssets }: AdminAssetsManagerProps) {
  const [assets, setAssets] = useState(initialAssets);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [altText, setAltText] = useState('');
  const [assetType, setAssetType] = useState('misc');
  const [folder, setFolder] = useState('misc');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);

  const upload = async () => {
    if (!file) {
      setError('请选择文件');
      return;
    }

    setPending(true);
    setError('');
    setMessage('');

    try {
      const formData = new FormData();
      formData.set('file', file);
      formData.set('title', title);
      formData.set('altText', altText);
      formData.set('assetType', assetType);
      formData.set('folder', folder);

      const response = await fetch('/api/admin/assets/upload', {
        method: 'POST',
        body: formData,
      });
      const result = (await response.json()) as {
        error?: string;
        publicUrl?: string;
        objectPath?: string;
      };

      if (!response.ok) {
        setError(result.error || '上传失败');
        return;
      }

      setMessage('上传成功，请刷新列表或继续上传。');
      setAssets((prev) => [
        {
          id: `${Date.now()}`,
          bucket: 'public-assets',
          object_path: result.objectPath || '',
          asset_type: assetType,
          title,
          alt_text: altText,
          file_name: file.name,
          public_url: result.publicUrl || '',
          source_path: '',
          file_size_bytes: file.size,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
      setFile(null);
      setTitle('');
      setAltText('');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/30 bg-white/85 p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">上传资产</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="标题"
            className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-900"
          />
          <input
            type="text"
            value={altText}
            onChange={(event) => setAltText(event.target.value)}
            placeholder="Alt 文本"
            className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-900"
          />
          <input
            type="text"
            value={assetType}
            onChange={(event) => setAssetType(event.target.value)}
            placeholder="asset type"
            className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-900"
          />
          <input
            type="text"
            value={folder}
            onChange={(event) => setFolder(event.target.value)}
            placeholder="folder"
            className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-900"
          />
          <input
            type="file"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-900 md:col-span-2"
          />
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        {message && <p className="mt-4 text-sm text-emerald-600">{message}</p>}

        <button
          type="button"
          onClick={upload}
          disabled={pending}
          className="mt-4 rounded-full bg-gray-900 px-4 py-2 text-sm text-white"
        >
          {pending ? '上传中...' : '上传'}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {assets.map((asset) => (
          <div
            key={`${asset.id}-${asset.object_path}`}
            className="rounded-3xl border border-white/30 bg-white/85 p-5 shadow-lg"
          >
            <div className="mb-2 text-sm font-medium text-gray-900">{asset.file_name}</div>
            <div className="mb-1 text-xs text-gray-500">{asset.object_path}</div>
            {asset.public_url && (
              <a
                href={asset.public_url}
                target="_blank"
                rel="noreferrer"
                className="mb-3 inline-block text-xs text-blue-600 underline"
              >
                打开资源
              </a>
            )}
            <div className="space-y-1 text-xs text-gray-600">
              <div>类型：{asset.asset_type || 'misc'}</div>
              <div>标题：{asset.title || '未填写'}</div>
              <div>Alt：{asset.alt_text || '未填写'}</div>
              <div>来源：{asset.source_path || '上传'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
