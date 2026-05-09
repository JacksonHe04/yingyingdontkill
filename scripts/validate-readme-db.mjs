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

async function countByProfile(supabase, table, profileId) {
  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', profileId);

  if (error) throw error;
  return count ?? 0;
}

async function main() {
  const url = getEnv('NEXT_PUBLIC_SUPABASE_URL');
  const key =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    getEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');

  const source = await loadJson(new URL('../data/readme.json', import.meta.url));
  const supabase = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, slug')
    .eq('slug', PROFILE_SLUG)
    .maybeSingle();
  if (profileError) throw profileError;
  if (!profile) throw new Error(`Profile "${PROFILE_SLUG}" not found`);

  const results = [
    ['profile_tags', source.basic.keywords.length + source.basic.values.length + source.basic.tags.length],
    [
      'profile_list_items',
      source.life.habits.length +
        source.life.diet.favorite_food.length +
        source.life.diet.favorite_drinks.length +
        source.work.work_preferences.length +
        source.creation.mottos.length +
        source.creation.quotes.length +
        source.thoughts.personal_philosophy.length +
        source.thoughts.industry_views.length +
        source.thoughts.ideology.length +
        source.thoughts.life_elements.length +
        source.thoughts.macro_vision.length +
        source.thoughts.personal_vision.length,
    ],
    ['experiences', source.experience.experience.length],
    ['schools', source.education.schools.length],
    ['jobs', source.work.jobs.length],
    ['development_skills', source.development.skills.tech_stack.length + source.development.skills.expertise.length],
    ['projects', source.development.projects.length],
    ['dev_tools', source.development.dev_tools.length],
    [
      'product_items',
      source.products.favorite_products.length +
        source.products.recommended_products.length +
        source.products.favorite_brands.length,
    ],
    [
      'hardware_items',
      4 + source.products.my_hardware.headphones.length,
    ],
    [
      'creation_items',
      source.creation.videos.length +
        source.creation.articles.length +
        source.creation.speeches.length,
    ],
    [
      'media_items',
      source.reading.books.length +
        source.reading.authors.length +
        source.films.films.length +
        source.films.directors.length +
        source.music.albums.length +
        source.music.songs.length +
        source.music.musicians.length +
        source.hiphop.albums.length +
        source.hiphop.songs.length +
        source.hiphop.musicians.length,
    ],
    ['performances', source.events.performances.length],
    ['contact_methods', source.contact.contact_info.length],
    ['platform_accounts', source.contact.platform_accounts.length],
    ['thought_qa', source.thoughts.qa.length],
    ['notifications', source.notifications.length],
  ];

  for (const [table, expected] of results) {
    const actual = await countByProfile(supabase, table, profile.id);
    const status = actual === expected ? 'OK' : 'MISMATCH';
    console.log(`${status.padEnd(8)} ${table.padEnd(20)} expected=${expected} actual=${actual}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
