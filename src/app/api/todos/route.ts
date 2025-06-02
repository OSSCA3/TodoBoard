import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('todo')
    .select('*')
    .order('priority', { ascending: true })
    .order('order', { ascending: true });

  if (error) {
    console.error('Todo 조회 실패', error);
    return NextResponse.json(
      { error: 'Todo 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ todos: data });
}
