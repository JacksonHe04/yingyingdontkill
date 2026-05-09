import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminContext } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';

type AssetPayload = {
  id: string;
  title: string;
  alt_text: string;
  asset_type: string;
};

export async function GET() {
  const admin = await getAdminContext();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from('media_assets')
      .select(
        'id, bucket, object_path, asset_type, title, alt_text, file_name, public_url, source_path, file_size_bytes, created_at'
      )
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ assets: data ?? [] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch assets', detail: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  const admin = await getAdminContext();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await req.json()) as AssetPayload;
    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from('media_assets')
      .update({
        title: body.title,
        alt_text: body.alt_text,
        asset_type: body.asset_type,
      })
      .eq('id', body.id);
    if (error) throw error;
    revalidatePath('/admin/assets');
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update asset', detail: (error as Error).message },
      { status: 500 }
    );
  }
}
