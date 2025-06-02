'use client';

import { useMemo, useState } from 'react';
import { createClient } from '@/libs/supabase/client';
import Button from '@/components/ui/buttons/button';

export default function LoginPage() {
  const supabase = useMemo(() => createClient(), []);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('로그인 실패:', error.message);
        alert('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
      alert('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center h-screen bg-[#f3edff]">
      <div className="border border-purple-400 rounded-lg p-8 shadow-md bg-white w-[320px] text-center">
        <h1 className="text-purple-600 text-xl font-semibold mb-6">로그인</h1>

        <Button
          variant="outline"
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2"
        >
          <img
            src="/images/Google.png"
            alt="Google logo"
            className="w-5 h-5"
            width={20}
            height={20}
          />
          Google 계정으로 로그인
        </Button>
      </div>
    </main>
  );
}
