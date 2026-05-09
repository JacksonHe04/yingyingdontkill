'use client';

import { useState } from 'react';
import type { ReadmeData } from '@/types';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
type SaveState = Record<string, { status: SaveStatus; message: string }>;
type ObjectFieldConfig = {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'string-list';
};

type StringListEditorProps = {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
};

type ObjectArrayEditorProps<T extends Record<string, unknown>> = {
  title: string;
  items: T[];
  onChange: (next: T[]) => void;
  createItem: () => T;
  fields: ObjectFieldConfig[];
};

function AdminSection({
  title,
  description,
  onSave,
  saveState,
  children,
}: {
  title: string;
  description?: string;
  onSave: () => void;
  saveState?: { status: SaveStatus; message: string };
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/30 bg-white/85 p-6 shadow-lg">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
          {saveState?.message && (
            <p
              className={`mt-2 text-sm ${
                saveState.status === 'error' ? 'text-red-600' : 'text-emerald-600'
              }`}
            >
              {saveState.message}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={saveState?.status === 'saving'}
          className="rounded-full bg-gray-900 px-4 py-2 text-sm text-white"
        >
          {saveState?.status === 'saving' ? '保存中...' : '保存本分区'}
        </button>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function TextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-900"
      />
    </label>
  );
}

function TextAreaInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-28 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-900"
      />
    </label>
  );
}

function StringListEditor({ label, value, onChange }: StringListEditorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <button
          type="button"
          onClick={() => onChange([...value, ''])}
          className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
        >
          添加
        </button>
      </div>

      <div className="space-y-2">
        {value.map((item, index) => (
          <div key={`${label}-${index}`} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(event) => {
                const next = [...value];
                next[index] = event.target.value;
                onChange(next);
              }}
              className="flex-1 rounded-2xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-gray-900"
            />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, currentIndex) => currentIndex !== index))}
              className="rounded-full bg-red-50 px-3 py-2 text-xs text-red-600"
            >
              删除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ObjectArrayEditor<T extends Record<string, unknown>>({
  title,
  items,
  onChange,
  createItem,
  fields,
}: ObjectArrayEditorProps<T>) {
  const setItemField = (
    index: number,
    key: string,
    value: string | string[]
  ) => {
    const next = [...items];
    next[index] = {
      ...next[index],
      [key]: value,
    };
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button
          type="button"
          onClick={() => onChange([...items, createItem()])}
          className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
        >
          添加条目
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={`${title}-${index}`}
            className="rounded-2xl border border-gray-100 bg-white p-4"
          >
            <div className="mb-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  if (index === 0) return;
                  const next = [...items];
                  [next[index - 1], next[index]] = [next[index], next[index - 1]];
                  onChange(next);
                }}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
              >
                上移
              </button>
              <button
                type="button"
                onClick={() => {
                  if (index === items.length - 1) return;
                  const next = [...items];
                  [next[index + 1], next[index]] = [next[index], next[index + 1]];
                  onChange(next);
                }}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
              >
                下移
              </button>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, currentIndex) => currentIndex !== index))}
                className="rounded-full bg-red-50 px-3 py-1 text-xs text-red-600"
              >
                删除
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {fields.map((field) => {
                const value = item[field.key];
                if (field.type === 'textarea') {
                  return (
                    <div key={field.key} className="md:col-span-2">
                      <TextAreaInput
                        label={field.label}
                        value={typeof value === 'string' ? value : ''}
                        onChange={(next) => setItemField(index, field.key, next)}
                      />
                    </div>
                  );
                }

                if (field.type === 'string-list') {
                  return (
                    <div key={field.key} className="md:col-span-2">
                      <StringListEditor
                        label={field.label}
                        value={Array.isArray(value) ? (value as string[]) : []}
                        onChange={(next) => setItemField(index, field.key, next)}
                      />
                    </div>
                  );
                }

                return (
                  <TextInput
                    key={field.key}
                    label={field.label}
                    value={typeof value === 'string' ? value : ''}
                    onChange={(next) => setItemField(index, field.key, next)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function putSection(section: string, payload: unknown) {
  const response = await fetch(`/api/admin/content/${section}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const result = (await response.json()) as { error?: string; detail?: string };
  if (!response.ok) {
    throw new Error(result.detail || result.error || '保存失败');
  }
}

export default function AdminContentEditor({ initialData }: { initialData: ReadmeData }) {
  const [draft, setDraft] = useState(initialData);
  const [saveState, setSaveState] = useState<SaveState>({});

  const setStateFor = (section: string, status: SaveStatus, message: string) => {
    setSaveState((prev) => ({
      ...prev,
      [section]: { status, message },
    }));
  };

  const save = async (section: string, payload: unknown) => {
    setStateFor(section, 'saving', '');
    try {
      await putSection(section, payload);
      setStateFor(section, 'saved', '保存成功');
    } catch (error) {
      setStateFor(section, 'error', (error as Error).message);
    }
  };

  return (
    <div className="space-y-8">
      <AdminSection
        title="基础与站点"
        onSave={() => save('profile', { meta: draft.meta, basic: draft.basic })}
        saveState={saveState.profile}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="站点标题"
            value={draft.meta.title}
            onChange={(value) =>
              setDraft((prev) => ({ ...prev, meta: { ...prev.meta, title: value } }))
            }
          />
          <TextInput
            label="作者"
            value={draft.meta.author}
            onChange={(value) =>
              setDraft((prev) => ({ ...prev, meta: { ...prev.meta, author: value } }))
            }
          />
          <div className="md:col-span-2">
            <TextAreaInput
              label="站点描述"
              value={draft.meta.description}
              onChange={(value) =>
                setDraft((prev) => ({
                  ...prev,
                  meta: { ...prev.meta, description: value },
                }))
              }
            />
          </div>
          <TextInput
            label="展示名称"
            value={draft.basic.name}
            onChange={(value) =>
              setDraft((prev) => ({ ...prev, basic: { ...prev.basic, name: value } }))
            }
          />
          <TextInput
            label="当前状态"
            value={draft.basic.current_status}
            onChange={(value) =>
              setDraft((prev) => ({
                ...prev,
                basic: { ...prev.basic, current_status: value },
              }))
            }
          />
          <div className="md:col-span-2">
            <TextAreaInput
              label="简介"
              value={draft.basic.intro}
              onChange={(value) =>
                setDraft((prev) => ({ ...prev, basic: { ...prev.basic, intro: value } }))
              }
            />
          </div>
        </div>
        <StringListEditor
          label="关键词"
          value={draft.basic.keywords}
          onChange={(value) =>
            setDraft((prev) => ({ ...prev, basic: { ...prev.basic, keywords: value } }))
          }
        />
        <StringListEditor
          label="价值观"
          value={draft.basic.values}
          onChange={(value) =>
            setDraft((prev) => ({ ...prev, basic: { ...prev.basic, values: value } }))
          }
        />
        <StringListEditor
          label="标签"
          value={draft.basic.tags}
          onChange={(value) =>
            setDraft((prev) => ({ ...prev, basic: { ...prev.basic, tags: value } }))
          }
        />
      </AdminSection>

      <AdminSection
        title="生活"
        onSave={() => save('life', draft.life)}
        saveState={saveState.life}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="当前城市"
            value={draft.life.current_city}
            onChange={(value) =>
              setDraft((prev) => ({ ...prev, life: { ...prev.life, current_city: value } }))
            }
          />
          <TextInput
            label="生日"
            value={draft.life.birth_date}
            onChange={(value) =>
              setDraft((prev) => ({ ...prev, life: { ...prev.life, birth_date: value } }))
            }
          />
          <TextInput
            label="生活 MBTI"
            value={draft.life.mbti.life_mbti}
            onChange={(value) =>
              setDraft((prev) => ({
                ...prev,
                life: { ...prev.life, mbti: { ...prev.life.mbti, life_mbti: value } },
              }))
            }
          />
          <TextInput
            label="工作 MBTI"
            value={draft.life.mbti.work_mbti}
            onChange={(value) =>
              setDraft((prev) => ({
                ...prev,
                life: { ...prev.life, mbti: { ...prev.life.mbti, work_mbti: value } },
              }))
            }
          />
          <TextInput
            label="星座"
            value={draft.life.zodiac_sign}
            onChange={(value) =>
              setDraft((prev) => ({ ...prev, life: { ...prev.life, zodiac_sign: value } }))
            }
          />
        </div>
        <StringListEditor
          label="习惯"
          value={draft.life.habits}
          onChange={(value) =>
            setDraft((prev) => ({ ...prev, life: { ...prev.life, habits: value } }))
          }
        />
        <StringListEditor
          label="喜欢的食物"
          value={draft.life.diet.favorite_food}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              life: { ...prev.life, diet: { ...prev.life.diet, favorite_food: value } },
            }))
          }
        />
        <StringListEditor
          label="喜欢的饮品"
          value={draft.life.diet.favorite_drinks}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              life: { ...prev.life, diet: { ...prev.life.diet, favorite_drinks: value } },
            }))
          }
        />
      </AdminSection>

      <AdminSection
        title="经历"
        onSave={() => save('experience', draft.experience)}
        saveState={saveState.experience}
      >
        <ObjectArrayEditor
          title="经历列表"
          items={draft.experience.experience}
          onChange={(value) =>
            setDraft((prev) => ({ ...prev, experience: { experience: value } }))
          }
          createItem={() => ({ city: '', date: '', description: '' })}
          fields={[
            { key: 'city', label: '城市' },
            { key: 'date', label: '日期' },
            { key: 'description', label: '描述', type: 'textarea' },
          ]}
        />
      </AdminSection>

      <AdminSection
        title="教育"
        onSave={() => save('education', draft.education)}
        saveState={saveState.education}
      >
        <ObjectArrayEditor
          title="学校经历"
          items={draft.education.schools}
          onChange={(value) =>
            setDraft((prev) => ({ ...prev, education: { ...prev.education, schools: value } }))
          }
          createItem={() => ({
            degree: '',
            major: '',
            institution: '',
            start_date: '',
            end_date: '',
          })}
          fields={[
            { key: 'degree', label: '学历' },
            { key: 'major', label: '专业/班级' },
            { key: 'institution', label: '学校' },
            { key: 'start_date', label: '开始时间' },
            { key: 'end_date', label: '结束时间' },
          ]}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="本科专业"
            value={draft.education.undergraduate_major}
            onChange={(value) =>
              setDraft((prev) => ({
                ...prev,
                education: { ...prev.education, undergraduate_major: value },
              }))
            }
          />
          <TextInput
            label="本科导师"
            value={draft.education.undergraduate_advisor}
            onChange={(value) =>
              setDraft((prev) => ({
                ...prev,
                education: { ...prev.education, undergraduate_advisor: value },
              }))
            }
          />
        </div>
      </AdminSection>

      <AdminSection
        title="工作"
        onSave={() => save('work', draft.work)}
        saveState={saveState.work}
      >
        <TextInput
          label="当前身份"
          value={draft.work.current_job}
          onChange={(value) =>
            setDraft((prev) => ({ ...prev, work: { ...prev.work, current_job: value } }))
          }
        />
        <StringListEditor
          label="工作偏好"
          value={draft.work.work_preferences}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              work: { ...prev.work, work_preferences: value },
            }))
          }
        />
        <ObjectArrayEditor
          title="工作经历"
          items={draft.work.jobs}
          onChange={(value) =>
            setDraft((prev) => ({ ...prev, work: { ...prev.work, jobs: value } }))
          }
          createItem={() => ({
            company_name: '',
            position: '',
            position_type: '',
            start_date: '',
            end_date: '',
            products_responsible_for: '',
            job_summary: '',
            work_output: '',
          })}
          fields={[
            { key: 'company_name', label: '公司' },
            { key: 'position', label: '岗位' },
            { key: 'position_type', label: '类型' },
            { key: 'start_date', label: '开始时间' },
            { key: 'end_date', label: '结束时间' },
            { key: 'products_responsible_for', label: '负责产品', type: 'textarea' },
            { key: 'job_summary', label: '工作总结', type: 'textarea' },
            { key: 'work_output', label: '工作产出', type: 'textarea' },
          ]}
        />
      </AdminSection>

      <AdminSection
        title="开发"
        onSave={() => save('development', draft.development)}
        saveState={saveState.development}
      >
        <StringListEditor
          label="技术栈"
          value={draft.development.skills.tech_stack}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              development: {
                ...prev.development,
                skills: { ...prev.development.skills, tech_stack: value },
              },
            }))
          }
        />
        <StringListEditor
          label="专长"
          value={draft.development.skills.expertise}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              development: {
                ...prev.development,
                skills: { ...prev.development.skills, expertise: value },
              },
            }))
          }
        />
        <ObjectArrayEditor
          title="项目"
          items={draft.development.projects}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              development: { ...prev.development, projects: value },
            }))
          }
          createItem={() => ({
            project_name: '',
            github: '',
            link: '',
            description: '',
            tech_stack: [],
            role: [],
            start_date: '',
            end_date: '',
            report_link: '',
          })}
          fields={[
            { key: 'project_name', label: '项目名' },
            { key: 'github', label: 'GitHub' },
            { key: 'link', label: '线上链接' },
            { key: 'start_date', label: '开始时间' },
            { key: 'end_date', label: '结束时间' },
            { key: 'report_link', label: '报告链接' },
            { key: 'description', label: '项目描述', type: 'textarea' },
            { key: 'tech_stack', label: '技术栈', type: 'string-list' },
            { key: 'role', label: '角色', type: 'string-list' },
          ]}
        />
        <ObjectArrayEditor
          title="开发工具"
          items={draft.development.dev_tools}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              development: { ...prev.development, dev_tools: value },
            }))
          }
          createItem={() => ({
            name: '',
            link: '',
            comment: '',
            tags: [],
          })}
          fields={[
            { key: 'name', label: '名称' },
            { key: 'link', label: '链接' },
            { key: 'comment', label: '说明', type: 'textarea' },
            { key: 'tags', label: '标签', type: 'string-list' },
          ]}
        />
      </AdminSection>

      <AdminSection
        title="产品"
        onSave={() => save('products', draft.products)}
        saveState={saveState.products}
      >
        <ObjectArrayEditor
          title="最爱产品"
          items={draft.products.favorite_products}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              products: { ...prev.products, favorite_products: value },
            }))
          }
          createItem={() => ({ name: '', link: '', intro: '', tags: [] })}
          fields={[
            { key: 'name', label: '名称' },
            { key: 'link', label: '链接' },
            { key: 'intro', label: '介绍', type: 'textarea' },
            { key: 'tags', label: '标签', type: 'string-list' },
          ]}
        />
        <ObjectArrayEditor
          title="推荐产品"
          items={draft.products.recommended_products}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              products: { ...prev.products, recommended_products: value },
            }))
          }
          createItem={() => ({ name: '', link: '', intro: '', tags: [] })}
          fields={[
            { key: 'name', label: '名称' },
            { key: 'link', label: '链接' },
            { key: 'intro', label: '介绍', type: 'textarea' },
            { key: 'tags', label: '标签', type: 'string-list' },
          ]}
        />
        <ObjectArrayEditor
          title="喜爱品牌"
          items={draft.products.favorite_brands}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              products: { ...prev.products, favorite_brands: value },
            }))
          }
          createItem={() => ({ name: '', link: '', intro: '', tags: [] })}
          fields={[
            { key: 'name', label: '名称' },
            { key: 'link', label: '链接' },
            { key: 'intro', label: '介绍', type: 'textarea' },
            { key: 'tags', label: '标签', type: 'string-list' },
          ]}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="手机"
            value={draft.products.my_hardware.phone}
            onChange={(value) =>
              setDraft((prev) => ({
                ...prev,
                products: {
                  ...prev.products,
                  my_hardware: { ...prev.products.my_hardware, phone: value },
                },
              }))
            }
          />
          <TextInput
            label="电脑"
            value={draft.products.my_hardware.computer}
            onChange={(value) =>
              setDraft((prev) => ({
                ...prev,
                products: {
                  ...prev.products,
                  my_hardware: { ...prev.products.my_hardware, computer: value },
                },
              }))
            }
          />
          <TextInput
            label="平板"
            value={draft.products.my_hardware.tablet}
            onChange={(value) =>
              setDraft((prev) => ({
                ...prev,
                products: {
                  ...prev.products,
                  my_hardware: { ...prev.products.my_hardware, tablet: value },
                },
              }))
            }
          />
          <TextInput
            label="手表/手环"
            value={draft.products.my_hardware.smartwatch}
            onChange={(value) =>
              setDraft((prev) => ({
                ...prev,
                products: {
                  ...prev.products,
                  my_hardware: { ...prev.products.my_hardware, smartwatch: value },
                },
              }))
            }
          />
        </div>
        <StringListEditor
          label="耳机"
          value={draft.products.my_hardware.headphones}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              products: {
                ...prev.products,
                my_hardware: { ...prev.products.my_hardware, headphones: value },
              },
            }))
          }
        />
      </AdminSection>

      <AdminSection
        title="创作"
        onSave={() => save('creation', draft.creation)}
        saveState={saveState.creation}
      >
        <ObjectArrayEditor
          title="视频"
          items={draft.creation.videos}
          onChange={(value) =>
            setDraft((prev) => ({ ...prev, creation: { ...prev.creation, videos: value } }))
          }
          createItem={() => ({ series: '', title: '', video_link: '', podcast_link: '' })}
          fields={[
            { key: 'series', label: '系列' },
            { key: 'title', label: '标题' },
            { key: 'video_link', label: '视频链接' },
            { key: 'podcast_link', label: '播客链接' },
          ]}
        />
        <ObjectArrayEditor
          title="文章"
          items={draft.creation.articles}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              creation: { ...prev.creation, articles: value },
            }))
          }
          createItem={() => ({ title: '', link: '', excerpt: '' })}
          fields={[
            { key: 'title', label: '标题' },
            { key: 'link', label: '链接' },
            { key: 'excerpt', label: '摘录', type: 'textarea' },
          ]}
        />
        <ObjectArrayEditor
          title="演讲"
          items={draft.creation.speeches}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              creation: { ...prev.creation, speeches: value },
            }))
          }
          createItem={() => ({
            speech_name: '',
            link: '',
            outline_doc: '',
            presentation_link: '',
          })}
          fields={[
            { key: 'speech_name', label: '名称' },
            { key: 'link', label: '链接' },
            { key: 'outline_doc', label: '提纲文档' },
            { key: 'presentation_link', label: '演示文稿' },
          ]}
        />
        <StringListEditor
          label="座右铭"
          value={draft.creation.mottos}
          onChange={(value) =>
            setDraft((prev) => ({ ...prev, creation: { ...prev.creation, mottos: value } }))
          }
        />
        <StringListEditor
          label="语录"
          value={draft.creation.quotes}
          onChange={(value) =>
            setDraft((prev) => ({ ...prev, creation: { ...prev.creation, quotes: value } }))
          }
        />
      </AdminSection>

      <AdminSection
        title="阅读"
        onSave={() => save('reading', draft.reading)}
        saveState={saveState.reading}
      >
        <ObjectArrayEditor
          title="书籍"
          items={draft.reading.books}
          onChange={(value) =>
            setDraft((prev) => ({ ...prev, reading: { ...prev.reading, books: value } }))
          }
          createItem={() => ({ name: '', author: '', country: '', link: '', comment: '' })}
          fields={[
            { key: 'name', label: '书名' },
            { key: 'author', label: '作者' },
            { key: 'country', label: '国家/地区' },
            { key: 'link', label: '链接' },
            { key: 'comment', label: '评语', type: 'textarea' },
          ]}
        />
        <ObjectArrayEditor
          title="作者"
          items={draft.reading.authors}
          onChange={(value) =>
            setDraft((prev) => ({ ...prev, reading: { ...prev.reading, authors: value } }))
          }
          createItem={() => ({ name: '', country: '', link: '', comment: '' })}
          fields={[
            { key: 'name', label: '姓名' },
            { key: 'country', label: '国家/地区' },
            { key: 'link', label: '链接' },
            { key: 'comment', label: '评语', type: 'textarea' },
          ]}
        />
      </AdminSection>

      <AdminSection
        title="影视"
        onSave={() => save('films', draft.films)}
        saveState={saveState.films}
      >
        <ObjectArrayEditor
          title="影片"
          items={draft.films.films}
          onChange={(value) =>
            setDraft((prev) => ({ ...prev, films: { ...prev.films, films: value } }))
          }
          createItem={() => ({ name: '', director: '', country: '', link: '', comment: '' })}
          fields={[
            { key: 'name', label: '片名' },
            { key: 'director', label: '导演' },
            { key: 'country', label: '国家/地区' },
            { key: 'link', label: '链接' },
            { key: 'comment', label: '评语', type: 'textarea' },
          ]}
        />
        <ObjectArrayEditor
          title="导演"
          items={draft.films.directors}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              films: { ...prev.films, directors: value },
            }))
          }
          createItem={() => ({ name: '', country: '', link: '', comment: '' })}
          fields={[
            { key: 'name', label: '姓名' },
            { key: 'country', label: '国家/地区' },
            { key: 'link', label: '链接' },
            { key: 'comment', label: '评语', type: 'textarea' },
          ]}
        />
      </AdminSection>

      <AdminSection
        title="音乐"
        onSave={() => save('music', draft.music)}
        saveState={saveState.music}
      >
        <ObjectArrayEditor
          title="专辑"
          items={draft.music.albums}
          onChange={(value) =>
            setDraft((prev) => ({ ...prev, music: { ...prev.music, albums: value } }))
          }
          createItem={() => ({ name: '', artist: '', link: '', comment: '' })}
          fields={[
            { key: 'name', label: '名称' },
            { key: 'artist', label: '艺术家' },
            { key: 'link', label: '链接' },
            { key: 'comment', label: '评语', type: 'textarea' },
          ]}
        />
        <ObjectArrayEditor
          title="歌曲"
          items={draft.music.songs}
          onChange={(value) =>
            setDraft((prev) => ({ ...prev, music: { ...prev.music, songs: value } }))
          }
          createItem={() => ({ name: '', artist: '', album: '', link: '', comment: '' })}
          fields={[
            { key: 'name', label: '名称' },
            { key: 'artist', label: '艺术家' },
            { key: 'album', label: '所属专辑' },
            { key: 'link', label: '链接' },
            { key: 'comment', label: '评语', type: 'textarea' },
          ]}
        />
        <ObjectArrayEditor
          title="音乐人"
          items={draft.music.musicians}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              music: { ...prev.music, musicians: value },
            }))
          }
          createItem={() => ({ name: '', region: '', link: '', comment: '' })}
          fields={[
            { key: 'name', label: '姓名' },
            { key: 'region', label: '地区' },
            { key: 'link', label: '链接' },
            { key: 'comment', label: '评语', type: 'textarea' },
          ]}
        />
      </AdminSection>

      <AdminSection
        title="嘻哈"
        onSave={() => save('hiphop', draft.hiphop)}
        saveState={saveState.hiphop}
      >
        <ObjectArrayEditor
          title="专辑"
          items={draft.hiphop.albums}
          onChange={(value) =>
            setDraft((prev) => ({ ...prev, hiphop: { ...prev.hiphop, albums: value } }))
          }
          createItem={() => ({ name: '', artist: '', link: '', comment: '' })}
          fields={[
            { key: 'name', label: '名称' },
            { key: 'artist', label: '艺术家' },
            { key: 'link', label: '链接' },
            { key: 'comment', label: '评语', type: 'textarea' },
          ]}
        />
        <ObjectArrayEditor
          title="歌曲"
          items={draft.hiphop.songs}
          onChange={(value) =>
            setDraft((prev) => ({ ...prev, hiphop: { ...prev.hiphop, songs: value } }))
          }
          createItem={() => ({ name: '', artist: '', album: '', link: '', comment: '' })}
          fields={[
            { key: 'name', label: '名称' },
            { key: 'artist', label: '艺术家' },
            { key: 'album', label: '所属专辑' },
            { key: 'link', label: '链接' },
            { key: 'comment', label: '评语', type: 'textarea' },
          ]}
        />
        <ObjectArrayEditor
          title="音乐人"
          items={draft.hiphop.musicians}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              hiphop: { ...prev.hiphop, musicians: value },
            }))
          }
          createItem={() => ({ name: '', region: '', link: '', comment: '' })}
          fields={[
            { key: 'name', label: '姓名' },
            { key: 'region', label: '地区' },
            { key: 'link', label: '链接' },
            { key: 'comment', label: '评语', type: 'textarea' },
          ]}
        />
      </AdminSection>

      <AdminSection
        title="活动"
        onSave={() => save('events', draft.events)}
        saveState={saveState.events}
      >
        <ObjectArrayEditor
          title="活动列表"
          items={draft.events.performances}
          onChange={(value) =>
            setDraft((prev) => ({ ...prev, events: { performances: value } }))
          }
          createItem={() => ({
            type: '',
            name: '',
            date: '',
            genre: '',
            location: '',
          })}
          fields={[
            { key: 'type', label: '类型' },
            { key: 'name', label: '名称' },
            { key: 'date', label: '日期' },
            { key: 'genre', label: '风格' },
            { key: 'location', label: '地点' },
          ]}
        />
      </AdminSection>

      <AdminSection
        title="联系"
        onSave={() => save('contact', draft.contact)}
        saveState={saveState.contact}
      >
        <ObjectArrayEditor
          title="联系方式"
          items={draft.contact.contact_info}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              contact: { ...prev.contact, contact_info: value },
            }))
          }
          createItem={() => ({ method_name: '', content: '' })}
          fields={[
            { key: 'method_name', label: '方式名' },
            { key: 'content', label: '内容' },
          ]}
        />
        <ObjectArrayEditor
          title="平台账号"
          items={draft.contact.platform_accounts}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              contact: { ...prev.contact, platform_accounts: value },
            }))
          }
          createItem={() => ({
            platform_name: '',
            username: '',
            homepage_link: '',
          })}
          fields={[
            { key: 'platform_name', label: '平台名' },
            { key: 'username', label: '用户名' },
            { key: 'homepage_link', label: '主页链接' },
          ]}
        />
      </AdminSection>

      <AdminSection
        title="思想"
        onSave={() => save('thoughts', draft.thoughts)}
        saveState={saveState.thoughts}
      >
        <StringListEditor
          label="个人哲学"
          value={draft.thoughts.personal_philosophy}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              thoughts: { ...prev.thoughts, personal_philosophy: value },
            }))
          }
        />
        <StringListEditor
          label="行业观点"
          value={draft.thoughts.industry_views}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              thoughts: { ...prev.thoughts, industry_views: value },
            }))
          }
        />
        <StringListEditor
          label="意识形态"
          value={draft.thoughts.ideology}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              thoughts: { ...prev.thoughts, ideology: value },
            }))
          }
        />
        <StringListEditor
          label="生命元素"
          value={draft.thoughts.life_elements}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              thoughts: { ...prev.thoughts, life_elements: value },
            }))
          }
        />
        <StringListEditor
          label="宏观愿景"
          value={draft.thoughts.macro_vision}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              thoughts: { ...prev.thoughts, macro_vision: value },
            }))
          }
        />
        <StringListEditor
          label="个人愿景"
          value={draft.thoughts.personal_vision}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              thoughts: { ...prev.thoughts, personal_vision: value },
            }))
          }
        />
        <ObjectArrayEditor
          title="问答"
          items={draft.thoughts.qa}
          onChange={(value) =>
            setDraft((prev) => ({ ...prev, thoughts: { ...prev.thoughts, qa: value } }))
          }
          createItem={() => ({ question: '', answer: '', source: '', date: '' })}
          fields={[
            { key: 'question', label: '问题', type: 'textarea' },
            { key: 'answer', label: '回答', type: 'textarea' },
            { key: 'source', label: '来源' },
            { key: 'date', label: '日期' },
          ]}
        />
      </AdminSection>

      <AdminSection
        title="通知"
        onSave={() => save('notifications', draft.notifications)}
        saveState={saveState.notifications}
      >
        <ObjectArrayEditor
          title="通知列表"
          items={draft.notifications}
          onChange={(value) => setDraft((prev) => ({ ...prev, notifications: value }))}
          createItem={() => ({ date: '', text: '', type: '' })}
          fields={[
            { key: 'date', label: '日期' },
            { key: 'type', label: '类型' },
            { key: 'text', label: '内容', type: 'textarea' },
          ]}
        />
      </AdminSection>
    </div>
  );
}
