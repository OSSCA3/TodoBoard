import { createClient } from './client';

/**
 * Retrieves the current authentication session using a Supabase client.
 *
 * @returns The current session object if available, or `null` if retrieval fails.
 */
export async function getSessionClient() {
  const supabase = createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error('세션 가져오기 실패:', error);
    return null;
  }

  return session;
}
