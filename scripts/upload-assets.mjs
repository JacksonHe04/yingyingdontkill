import { stat, readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const PROFILE_SLUG = process.env.PROFILE_SLUG || 'yingying';
const DIRECTORIES = [
  { localPath: 'docs/images', folder: 'docs-images', assetType: 'doc-image' },
];

function getEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function contentTypeFor(filePath) {
  if (filePath.endsWith('.png')) return 'image/png';
  if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) return 'image/jpeg';
  if (filePath.endsWith('.webp')) return 'image/webp';
  if (filePath.endsWith('.svg')) return 'image/svg+xml';
  if (filePath.endsWith('.gif')) return 'image/gif';
  if (filePath.endsWith('.pdf')) return 'application/pdf';
  return 'application/octet-stream';
}

async function getProfileId(supabase) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('slug', PROFILE_SLUG)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error(`Profile "${PROFILE_SLUG}" not found`);
  return data.id;
}

async function main() {
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
  const profileId = await getProfileId(supabase);

  for (const directory of DIRECTORIES) {
    const files = await walk(directory.localPath);
    for (const localPath of files) {
      const content = await readFile(localPath);
      const fileStat = await stat(localPath);
      const fileName = localPath.split('/').pop() || 'asset';
      const objectPath = `profiles/${PROFILE_SLUG}/${directory.folder}/${fileName}`;

      const uploadResult = await supabase.storage
        .from('public-assets')
        .upload(objectPath, content, {
          upsert: true,
          contentType: contentTypeFor(localPath),
        });

      if (uploadResult.error) throw uploadResult.error;

      const publicUrl = supabase.storage.from('public-assets').getPublicUrl(objectPath).data
        .publicUrl;

      const upsertResult = await supabase.from('media_assets').upsert(
        {
          profile_id: profileId,
          bucket: 'public-assets',
          object_path: objectPath,
          asset_type: directory.assetType,
          title: fileName,
          alt_text: fileName,
          file_name: fileName,
          public_url: publicUrl,
          source_path: localPath,
          file_size_bytes: fileStat.size,
          is_public: true,
        },
        { onConflict: 'bucket,object_path' }
      );

      if (upsertResult.error) throw upsertResult.error;
      console.log(`Uploaded ${localPath} -> ${objectPath}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
