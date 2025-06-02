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

export async function PATCH(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json(
      { error: 'Todo ID가 필요합니다.' },
      { status: 400 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from('todo')
    .update(body)
    .eq('id', parseInt(id))
    .select()
    .single();

  if (error) {
    console.error('Todo 업데이트 실패', error);
    return NextResponse.json(
      { error: 'Todo 업데이트 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}
