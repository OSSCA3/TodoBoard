'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSessionClient } from '@/libs/supabase/get-session-client';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      try {
        const session = await getSessionClient();

        if (session?.user?.id) {
          router.replace('/');
        } else {
          router.replace('/auth/login');
        }
      } catch (error) {
        console.error('세션 확인 중 오류 발생:', error);
        alert('세션 확인 중 오류가 발생했습니다.');
        router.replace('/auth/login'); // fallback
      }
    };

    redirect();
  }, [router]);

  return <p className="p-6 text-sm animate-pulse">로그인 처리 중입니다...</p>;
}
