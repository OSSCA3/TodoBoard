import { NextRequest, NextResponse } from 'next/server';
import { ErrorResponseBody } from '@/types/api';
import { Memo } from '@/types/memo';
import { mockMemoData } from '@/mocks/memo';

interface GetMemoParams {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<GetMemoParams> },
) {
  const { id } = await params;
  // TODO : 실제 DB의 데이터를 가져오도록 하기
  const memo = mockMemoData.find((memo) => memo.id === id);

  if (!memo) {
    return NextResponse.json<ErrorResponseBody>(
      { message: '메시지를 찾을 수 없습니다.' },
      { status: 404 },
    );
  }

  return NextResponse.json<Memo>(memo);
}
