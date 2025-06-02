import { createClient } from '@/libs/supabase/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  const supabase = await createClient();

  // 현재 로그인한 사용자 정보
  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();

  if (getUserError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 관리자 권한 Supabase client
  const adminClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    },
  );

  // 사용자 삭제
  const { error: deleteError } = await adminClient.auth.admin.deleteUser(
    user.id,
  );
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  // 세션 삭제
  const { error: signOutError } = await supabase.auth.signOut();
  if (signOutError) {
    return NextResponse.json({ error: signOutError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
