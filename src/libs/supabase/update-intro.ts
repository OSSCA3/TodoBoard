import { getUserId } from './get-id-client';
import { createClient } from './client';

export async function updateIntro(newIntro: string) {
  const userId = await getUserId();
  const supabase = createClient();

  const { error } = await supabase
    .from('profiles')
    .update({ intro: newIntro })
    .eq('id', userId);

  if (error) {
    console.error('업데이트 실패:', error.message);
    throw error;
  }

  console.log('업데이트 성공');
}
