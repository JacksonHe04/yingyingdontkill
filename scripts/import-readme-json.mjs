import { readFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';

const PROFILE_SLUG = process.env.PROFILE_SLUG || 'yingying';

function getEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

async function loadJson(filePath) {
  const raw = await readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

function orderedValues(values) {
  return values.map((value, index) => ({
    value,
    sort_order: index,
  }));
}

async function clearProfileData(supabase, profileId) {
  const deletions = [
    'messages',
    'media_assets',
    'notifications',
    'thought_qa',
    'platform_accounts',
    'contact_methods',
    'performances',
    'media_items',
    'creation_items',
    'hardware_items',
    'product_item_tags',
    'product_items',
    'dev_tool_tags',
    'dev_tools',
    'project_roles',
    'project_tech_stack',
    'projects',
    'development_skills',
    'jobs',
    'work_meta',
    'education_meta',
    'schools',
    'experiences',
    'profile_list_items',
    'profile_tags',
    'profile_life',
  ];

  for (const table of deletions) {
    const column = ['project_roles', 'project_tech_stack', 'dev_tool_tags', 'product_item_tags'].includes(table)
      ? null
      : 'profile_id';

    if (column) {
      const { error } = await supabase.from(table).delete().eq(column, profileId);
      if (error) throw error;
    }
  }

  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id')
    .eq('profile_id', profileId);
  if (projectsError) throw projectsError;

  const projectIds = (projects ?? []).map((item) => item.id);
  if (projectIds.length > 0) {
    const { error: deleteProjectRolesError } = await supabase
      .from('project_roles')
      .delete()
      .in('project_id', projectIds);
    if (deleteProjectRolesError) throw deleteProjectRolesError;

    const { error: deleteProjectTechError } = await supabase
      .from('project_tech_stack')
      .delete()
      .in('project_id', projectIds);
    if (deleteProjectTechError) throw deleteProjectTechError;
  }

  const { error: deleteProjectsError } = await supabase.from('projects').delete().eq('profile_id', profileId);
  if (deleteProjectsError) throw deleteProjectsError;

  const { data: devTools, error: devToolsError } = await supabase
    .from('dev_tools')
    .select('id')
    .eq('profile_id', profileId);
  if (devToolsError) throw devToolsError;

  const devToolIds = (devTools ?? []).map((item) => item.id);
  if (devToolIds.length > 0) {
    const { error: deleteDevToolTagsError } = await supabase
      .from('dev_tool_tags')
      .delete()
      .in('dev_tool_id', devToolIds);
    if (deleteDevToolTagsError) throw deleteDevToolTagsError;
  }

  const { error: deleteDevToolsError } = await supabase.from('dev_tools').delete().eq('profile_id', profileId);
  if (deleteDevToolsError) throw deleteDevToolsError;

  const { data: productItems, error: productItemsError } = await supabase
    .from('product_items')
    .select('id')
    .eq('profile_id', profileId);
  if (productItemsError) throw productItemsError;

  const productItemIds = (productItems ?? []).map((item) => item.id);
  if (productItemIds.length > 0) {
    const { error: deleteProductItemTagsError } = await supabase
      .from('product_item_tags')
      .delete()
      .in('product_item_id', productItemIds);
    if (deleteProductItemTagsError) throw deleteProductItemTagsError;
  }

  const { error: deleteProductItemsError } = await supabase
    .from('product_items')
    .delete()
    .eq('profile_id', profileId);
  if (deleteProductItemsError) throw deleteProductItemsError;
}

async function insertMany(supabase, table, rows) {
  if (!rows.length) return [];
  const { data, error } = await supabase.from(table).insert(rows).select();
  if (error) throw error;
  return data ?? [];
}

async function main() {
  const url = getEnv('NEXT_PUBLIC_SUPABASE_URL');
  const serviceRole =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRole) {
    throw new Error('Missing SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY');
  }

  const source = await loadJson(new URL('../data/readme.json', import.meta.url));
  const supabase = createClient(url, serviceRole, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const profilePayload = {
    slug: PROFILE_SLUG,
    name: source.basic.name,
    intro: source.basic.intro,
    current_status: source.basic.current_status,
    meta_title: source.meta.title,
    meta_description: source.meta.description,
    meta_author: source.meta.author,
    is_published: true,
  };

  const { data: profileRows, error: profileError } = await supabase
    .from('profiles')
    .upsert(profilePayload, { onConflict: 'slug' })
    .select('id, slug')
    .limit(1);
  if (profileError) throw profileError;

  const profile = profileRows?.[0];
  if (!profile) throw new Error('Failed to upsert profile');

  await clearProfileData(supabase, profile.id);

  const { error: lifeError } = await supabase.from('profile_life').upsert({
    profile_id: profile.id,
    current_city: source.life.current_city,
    birth_date: source.life.birth_date,
    zodiac_sign: source.life.zodiac_sign,
    life_mbti: source.life.mbti.life_mbti,
    work_mbti: source.life.mbti.work_mbti,
  });
  if (lifeError) throw lifeError;

  await insertMany(
    supabase,
    'profile_tags',
    [
      ...orderedValues(source.basic.keywords).map((item) => ({
        profile_id: profile.id,
        tag_type: 'keyword',
        ...item,
      })),
      ...orderedValues(source.basic.values).map((item) => ({
        profile_id: profile.id,
        tag_type: 'value',
        ...item,
      })),
      ...orderedValues(source.basic.tags).map((item) => ({
        profile_id: profile.id,
        tag_type: 'tag',
        ...item,
      })),
    ]
  );

  await insertMany(
    supabase,
    'profile_list_items',
    [
      ...orderedValues(source.life.habits).map((item) => ({
        profile_id: profile.id,
        list_type: 'habit',
        ...item,
      })),
      ...orderedValues(source.life.diet.favorite_food).map((item) => ({
        profile_id: profile.id,
        list_type: 'favorite_food',
        ...item,
      })),
      ...orderedValues(source.life.diet.favorite_drinks).map((item) => ({
        profile_id: profile.id,
        list_type: 'favorite_drink',
        ...item,
      })),
      ...orderedValues(source.work.work_preferences).map((item) => ({
        profile_id: profile.id,
        list_type: 'work_preference',
        ...item,
      })),
      ...orderedValues(source.creation.mottos).map((item) => ({
        profile_id: profile.id,
        list_type: 'motto',
        ...item,
      })),
      ...orderedValues(source.creation.quotes).map((item) => ({
        profile_id: profile.id,
        list_type: 'quote',
        ...item,
      })),
      ...orderedValues(source.thoughts.personal_philosophy).map((item) => ({
        profile_id: profile.id,
        list_type: 'personal_philosophy',
        ...item,
      })),
      ...orderedValues(source.thoughts.industry_views).map((item) => ({
        profile_id: profile.id,
        list_type: 'industry_view',
        ...item,
      })),
      ...orderedValues(source.thoughts.ideology).map((item) => ({
        profile_id: profile.id,
        list_type: 'ideology',
        ...item,
      })),
      ...orderedValues(source.thoughts.life_elements).map((item) => ({
        profile_id: profile.id,
        list_type: 'life_element',
        ...item,
      })),
      ...orderedValues(source.thoughts.macro_vision).map((item) => ({
        profile_id: profile.id,
        list_type: 'macro_vision',
        ...item,
      })),
      ...orderedValues(source.thoughts.personal_vision).map((item) => ({
        profile_id: profile.id,
        list_type: 'personal_vision',
        ...item,
      })),
    ]
  );

  await insertMany(
    supabase,
    'experiences',
    source.experience.experience.map((item, index) => ({
      profile_id: profile.id,
      city: item.city,
      event_date: item.date,
      description: item.description,
      sort_order: index,
    }))
  );

  await insertMany(
    supabase,
    'schools',
    source.education.schools.map((item, index) => ({
      profile_id: profile.id,
      degree: item.degree,
      major: item.major,
      institution: item.institution,
      start_date: item.start_date,
      end_date: item.end_date,
      sort_order: index,
    }))
  );

  const { error: educationMetaError } = await supabase.from('education_meta').upsert({
    profile_id: profile.id,
    undergraduate_major: source.education.undergraduate_major,
    undergraduate_advisor: source.education.undergraduate_advisor,
  });
  if (educationMetaError) throw educationMetaError;

  const { error: workMetaError } = await supabase.from('work_meta').upsert({
    profile_id: profile.id,
    current_job: source.work.current_job,
  });
  if (workMetaError) throw workMetaError;

  await insertMany(
    supabase,
    'jobs',
    source.work.jobs.map((item, index) => ({
      profile_id: profile.id,
      company_name: item.company_name,
      position: item.position,
      position_type: item.position_type,
      start_date: item.start_date,
      end_date: item.end_date,
      products_responsible_for: item.products_responsible_for,
      job_summary: item.job_summary,
      work_output: item.work_output,
      sort_order: index,
    }))
  );

  await insertMany(
    supabase,
    'development_skills',
    [
      ...orderedValues(source.development.skills.tech_stack).map((item) => ({
        profile_id: profile.id,
        skill_type: 'tech_stack',
        ...item,
      })),
      ...orderedValues(source.development.skills.expertise).map((item) => ({
        profile_id: profile.id,
        skill_type: 'expertise',
        ...item,
      })),
    ]
  );

  const projectRows = await insertMany(
    supabase,
    'projects',
    source.development.projects.map((item, index) => ({
      profile_id: profile.id,
      project_name: item.project_name,
      github_url: item.github,
      live_url: item.link,
      description: item.description,
      start_date: item.start_date,
      end_date: item.end_date,
      report_url: item.report_link || '',
      sort_order: index,
    }))
  );

  for (let index = 0; index < projectRows.length; index += 1) {
    const projectRow = projectRows[index];
    const sourceProject = source.development.projects[index];

    await insertMany(
      supabase,
      'project_roles',
      orderedValues(sourceProject.role).map((item) => ({
        project_id: projectRow.id,
        ...item,
      }))
    );

    await insertMany(
      supabase,
      'project_tech_stack',
      orderedValues(sourceProject.tech_stack).map((item) => ({
        project_id: projectRow.id,
        ...item,
      }))
    );
  }

  const devToolRows = await insertMany(
    supabase,
    'dev_tools',
    source.development.dev_tools.map((item, index) => ({
      profile_id: profile.id,
      name: item.name,
      link: item.link,
      comment: item.comment,
      sort_order: index,
    }))
  );

  for (let index = 0; index < devToolRows.length; index += 1) {
    await insertMany(
      supabase,
      'dev_tool_tags',
      orderedValues(source.development.dev_tools[index].tags).map((item) => ({
        dev_tool_id: devToolRows[index].id,
        ...item,
      }))
    );
  }

  const productRows = await insertMany(
    supabase,
    'product_items',
    [
      ...source.products.favorite_products.map((item, index) => ({
        profile_id: profile.id,
        item_type: 'favorite_product',
        name: item.name,
        link: item.link,
        intro: item.intro,
        sort_order: index,
      })),
      ...source.products.recommended_products.map((item, index) => ({
        profile_id: profile.id,
        item_type: 'recommended_product',
        name: item.name,
        link: item.link,
        intro: item.intro,
        sort_order: index,
      })),
      ...source.products.favorite_brands.map((item, index) => ({
        profile_id: profile.id,
        item_type: 'favorite_brand',
        name: item.name,
        link: item.link,
        intro: item.intro,
        sort_order: index,
      })),
    ]
  );

  const sourceProductGroups = [
    ...source.products.favorite_products,
    ...source.products.recommended_products,
    ...source.products.favorite_brands,
  ];

  for (let index = 0; index < productRows.length; index += 1) {
    await insertMany(
      supabase,
      'product_item_tags',
      orderedValues(sourceProductGroups[index].tags).map((item) => ({
        product_item_id: productRows[index].id,
        ...item,
      }))
    );
  }

  await insertMany(
    supabase,
    'hardware_items',
    [
      { profile_id: profile.id, category: 'phone', value: source.products.my_hardware.phone, sort_order: 0 },
      { profile_id: profile.id, category: 'computer', value: source.products.my_hardware.computer, sort_order: 0 },
      { profile_id: profile.id, category: 'tablet', value: source.products.my_hardware.tablet, sort_order: 0 },
      { profile_id: profile.id, category: 'smartwatch', value: source.products.my_hardware.smartwatch, sort_order: 0 },
      ...source.products.my_hardware.headphones.map((value, index) => ({
        profile_id: profile.id,
        category: 'headphones',
        value,
        sort_order: index,
      })),
    ]
  );

  await insertMany(
    supabase,
    'creation_items',
    [
      ...source.creation.videos.map((item, index) => ({
        profile_id: profile.id,
        item_type: 'video',
        series: item.series,
        title: item.title,
        link_primary: item.video_link,
        link_secondary: item.podcast_link,
        excerpt: '',
        outline_doc: '',
        sort_order: index,
      })),
      ...source.creation.articles.map((item, index) => ({
        profile_id: profile.id,
        item_type: 'article',
        series: '',
        title: item.title,
        link_primary: item.link,
        link_secondary: '',
        excerpt: item.excerpt,
        outline_doc: '',
        sort_order: index,
      })),
      ...source.creation.speeches.map((item, index) => ({
        profile_id: profile.id,
        item_type: 'speech',
        series: '',
        title: item.speech_name,
        link_primary: item.link,
        link_secondary: item.presentation_link,
        excerpt: '',
        outline_doc: item.outline_doc,
        sort_order: index,
      })),
    ]
  );

  await insertMany(
    supabase,
    'media_items',
    [
      ...source.reading.books.map((item, index) => ({
        profile_id: profile.id,
        domain: 'reading',
        item_type: 'book',
        name: item.name,
        creator: item.author,
        album: '',
        country_or_region: item.country,
        link: item.link,
        comment: item.comment,
        sort_order: index,
      })),
      ...source.reading.authors.map((item, index) => ({
        profile_id: profile.id,
        domain: 'reading',
        item_type: 'author',
        name: item.name,
        creator: '',
        album: '',
        country_or_region: item.country,
        link: item.link,
        comment: item.comment,
        sort_order: index,
      })),
      ...source.films.films.map((item, index) => ({
        profile_id: profile.id,
        domain: 'films',
        item_type: 'film',
        name: item.name,
        creator: item.director,
        album: '',
        country_or_region: item.country,
        link: item.link,
        comment: item.comment,
        sort_order: index,
      })),
      ...source.films.directors.map((item, index) => ({
        profile_id: profile.id,
        domain: 'films',
        item_type: 'director',
        name: item.name,
        creator: '',
        album: '',
        country_or_region: item.country,
        link: item.link,
        comment: item.comment,
        sort_order: index,
      })),
      ...source.music.albums.map((item, index) => ({
        profile_id: profile.id,
        domain: 'music',
        item_type: 'album',
        name: item.name,
        creator: item.artist,
        album: '',
        country_or_region: '',
        link: item.link,
        comment: item.comment,
        sort_order: index,
      })),
      ...source.music.songs.map((item, index) => ({
        profile_id: profile.id,
        domain: 'music',
        item_type: 'song',
        name: item.name,
        creator: item.artist,
        album: item.album,
        country_or_region: '',
        link: item.link,
        comment: item.comment,
        sort_order: index,
      })),
      ...source.music.musicians.map((item, index) => ({
        profile_id: profile.id,
        domain: 'music',
        item_type: 'musician',
        name: item.name,
        creator: '',
        album: '',
        country_or_region: item.region,
        link: item.link,
        comment: item.comment,
        sort_order: index,
      })),
      ...source.hiphop.albums.map((item, index) => ({
        profile_id: profile.id,
        domain: 'hiphop',
        item_type: 'album',
        name: item.name,
        creator: item.artist,
        album: '',
        country_or_region: '',
        link: item.link,
        comment: item.comment,
        sort_order: index,
      })),
      ...source.hiphop.songs.map((item, index) => ({
        profile_id: profile.id,
        domain: 'hiphop',
        item_type: 'song',
        name: item.name,
        creator: item.artist,
        album: item.album,
        country_or_region: '',
        link: item.link,
        comment: item.comment,
        sort_order: index,
      })),
      ...source.hiphop.musicians.map((item, index) => ({
        profile_id: profile.id,
        domain: 'hiphop',
        item_type: 'musician',
        name: item.name,
        creator: '',
        album: '',
        country_or_region: item.region,
        link: item.link,
        comment: item.comment,
        sort_order: index,
      })),
    ]
  );

  await insertMany(
    supabase,
    'performances',
    source.events.performances.map((item, index) => ({
      profile_id: profile.id,
      event_type: item.type,
      name: item.name,
      event_date: item.date,
      genre: item.genre,
      location: item.location,
      sort_order: index,
    }))
  );

  await insertMany(
    supabase,
    'contact_methods',
    source.contact.contact_info.map((item, index) => ({
      profile_id: profile.id,
      method_name: item.method_name,
      content: item.content,
      sort_order: index,
    }))
  );

  await insertMany(
    supabase,
    'platform_accounts',
    source.contact.platform_accounts.map((item, index) => ({
      profile_id: profile.id,
      platform_name: item.platform_name,
      username: item.username,
      homepage_link: item.homepage_link,
      sort_order: index,
    }))
  );

  await insertMany(
    supabase,
    'thought_qa',
    source.thoughts.qa.map((item, index) => ({
      profile_id: profile.id,
      question: item.question,
      answer: item.answer,
      source: item.source,
      qa_date: item.date,
      sort_order: index,
    }))
  );

  await insertMany(
    supabase,
    'notifications',
    source.notifications.map((item, index) => ({
      profile_id: profile.id,
      notification_date: item.date,
      text: item.text,
      type: item.type,
      sort_order: index,
    }))
  );

  console.log(`Imported profile "${profile.slug}" into Supabase.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
