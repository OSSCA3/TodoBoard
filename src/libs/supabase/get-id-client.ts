import { createClient } from './client';

export async function getUserId() {
  const supabase = createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.user) {
    throw new Error('로그인이 필요합니다.');
  }

  return session.user.id; // auth.users.id = profiles.id
}
