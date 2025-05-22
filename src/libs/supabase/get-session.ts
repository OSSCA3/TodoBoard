import { createClient } from './server';

// 현재 요청의 로그인 세션을 가져오는 함수
export async function getSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}
