import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminContext } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { DEFAULT_PROFILE_SLUG } from '@/lib/content/constants';

async function getProfileId() {
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from('profiles')
    .select('id')
    .eq('slug', DEFAULT_PROFILE_SLUG)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error(`Profile "${DEFAULT_PROFILE_SLUG}" not found`);
  return data.id;
}

export async function POST(req: Request) {
  const admin = await getAdminContext();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const assetType = String(formData.get('assetType') || 'misc');
    const title = String(formData.get('title') || '');
    const altText = String(formData.get('altText') || '');
    const folder = String(formData.get('folder') || 'misc');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const profileId = await getProfileId();
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    const safeName = file.name.replace(/\s+/g, '-');
    const objectPath = `profiles/${DEFAULT_PROFILE_SLUG}/${folder}/${Date.now()}-${safeName}`;

    const uploadResult = await adminClient.storage
      .from('public-assets')
      .upload(objectPath, fileBuffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      });

    if (uploadResult.error) {
      return NextResponse.json(
        { error: 'Failed to upload file', detail: uploadResult.error.message },
        { status: 500 }
      );
    }

    const publicUrl = adminClient.storage.from('public-assets').getPublicUrl(objectPath).data
      .publicUrl;

    const insertResult = await adminClient.from('media_assets').upsert(
      {
        profile_id: profileId,
        bucket: 'public-assets',
        object_path: objectPath,
        asset_type: assetType,
        title,
        alt_text: altText,
        file_name: file.name,
        public_url: publicUrl,
        source_path: '',
        file_size_bytes: file.size,
        is_public: true,
      },
      { onConflict: 'bucket,object_path' }
    );

    if (insertResult.error) {
      return NextResponse.json(
        { error: 'Failed to record asset', detail: insertResult.error.message },
        { status: 500 }
      );
    }

    revalidatePath('/admin/assets');
    return NextResponse.json({ ok: true, publicUrl, objectPath });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Asset upload failed',
        detail: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
