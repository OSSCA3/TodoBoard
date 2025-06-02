'use client';

import { createClient } from '@/libs/supabase/client';
import Button from '@/components/ui/buttons/button';

export default function LoginPage() {
  const supabase = createClient();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  return (
    <main className="flex items-center justify-center h-screen bg-[#f3edff]">
      <div className="border border-purple-400 rounded-lg p-8 shadow-md bg-white w-[320px] text-center">
        <h1 className="text-purple-600 text-xl font-semibold mb-6">로그인</h1>

        <Button
          variant="outline"
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-2"
        >
          <img src="/images/Google.png" alt="Google logo" className="w-5 h-5" />
          Google로 로그인
        </Button>
      </div>
    </main>
  );
}
