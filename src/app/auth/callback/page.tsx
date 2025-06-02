'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSessionClient } from '@/libs/supabase/get-session-client';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      const session = await getSessionClient();

      if (session?.user?.id) {
        router.replace('/');
      } else {
        router.replace('/auth/login');
      }
    };

    redirect();
  }, [router]);

  return <p className="p-6 text-sm animate-pulse">로그인 처리 중입니다...</p>;
}
