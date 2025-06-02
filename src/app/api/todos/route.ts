import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

/**
 * Retrieves all todo items from the database, ordered by priority and order.
 *
 * @returns A JSON response containing the list of todos, or an error message if retrieval fails.
 */
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

/**
 * Updates a todo item with the specified ID using data from the request body.
 *
 * @param request - The HTTP request containing the todo ID in the query string and update data in the JSON body.
 * @returns A JSON response with the updated todo item, or an error message with the appropriate HTTP status code if the update fails or the ID is missing.
 */
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
