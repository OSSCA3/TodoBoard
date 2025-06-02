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
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const body = await request.json();

    // ID 유효성 검사
    if (!id) {
      return NextResponse.json(
        { error: 'Todo ID is required' },
        { status: 400 },
      );
    }

    const todoId = parseInt(id, 10);
    if (isNaN(todoId)) {
      return NextResponse.json({ error: 'Invalid todo ID' }, { status: 400 });
    }

    // Supabase에서 todo 업데이트
    const { data, error } = await supabaseAdmin
      .from('todo')
      .update(body)
      .eq('id', todoId)
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
  } catch (e) {
    console.error('Unexpected error in PATCH /api/todos:', e);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 },
    );
  }
}
