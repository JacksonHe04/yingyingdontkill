import { createClient } from '@supabase/supabase-js';

function getEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

async function main() {
  const email = process.env.ADMIN_EMAIL;
  if (!email) {
    throw new Error('Missing ADMIN_EMAIL');
  }

  const url = getEnv('NEXT_PUBLIC_SUPABASE_URL');
  const key =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!key) {
    throw new Error('Missing SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY');
  }

  const supabase = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { error } = await supabase.from('admin_users').upsert(
    {
      email: email.toLowerCase(),
      display_name: process.env.ADMIN_DISPLAY_NAME || email,
      is_active: true,
    },
    { onConflict: 'email' }
  );

  if (error) throw error;

  console.log(`Seeded admin user: ${email.toLowerCase()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
