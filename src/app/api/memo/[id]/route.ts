import { NextRequest, NextResponse } from 'next/server';
import { ErrorResponseBody } from '@/types/api';
import { Memo } from '@/types/memo';
import { createAdminClient } from '@/libs/supabase/server';
import { TABLE_NAME } from '@/constants/supabase';

interface GetMemoParams {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<GetMemoParams> },
) {
  try {
    const { id } = await params;
    const supabase = await createAdminClient(); // TODO : 로그인 로직 이후에 인증된 사용자로 변경

    const { data: memo, error } = await supabase
      .from(TABLE_NAME.MEMO)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json<Memo>(memo);
  } catch (error) {
    console.error('메모 조회 실패', error);

    return NextResponse.json<ErrorResponseBody>(
      { message: '메모를 조회하는 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
