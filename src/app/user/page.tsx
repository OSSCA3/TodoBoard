'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/libs/supabase/client';
import { getSessionClient } from '@/libs/supabase/get-session-client';

export default function UserPage() {
  const [intro, setIntro] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // 사용자 세션 가져오기 및 intro 초기값 불러오기
  useEffect(() => {
    const fetchData = async () => {
      const session = await getSessionClient();

      // 비로그인시 /login으로 리디렉션
      if (!session?.user?.id) {
        router.push('/auth/login');
        return;
      }

      const id = session.user.id;
      setUserId(id);

      const { data, error } = await supabase
        .from('profiles')
        .select('intro')
        .eq('id', id)
        .single();

      if (error) {
        console.error('소개 불러오기 실패:', error.message);
        return;
      }

      setIntro(data?.intro ?? '');
    };

    fetchData();
  }, [supabase]);

  // 한줄소개 저장
  const handleSaveIntro = async () => {
    if (!userId) {
      alert('로그인 상태를 확인할 수 없습니다.');
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ intro })
      .eq('id', userId);

    if (error) {
      alert('저장 실패: ' + error.message);
    } else {
      alert('한줄소개가 저장되었습니다.');
    }
  };

  // 탈퇴하기
  const handleDeleteAccount = async () => {
    const confirmed = confirm('정말 탈퇴하시겠습니까?');
    if (!confirmed) return;

    const res = await fetch('/api/delete-user', {
      method: 'POST',
    });

    if (res.ok) {
      alert('탈퇴가 완료되었습니다.');
      router.push('/auth/login');
    } else {
      const { error } = await res.json();
      alert('탈퇴 실패: ' + error);
    }
  };

  // 로그아웃
  const handleLogout = async () => {
    const confirmed = confirm('정말 로그아웃하시겠습니까?');
    if (!confirmed) return;

    const { error } = await supabase.auth.signOut();
    if (error) {
      alert('로그아웃 실패: ' + error.message);
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <section className="max-w-3xl w-full bg-white rounded-r-2xl shadow-md p-8">
      <h1 className="text-lg font-semibold mb-4">한줄소개</h1>
      <textarea
        className="w-full h-[60px] p-2 border border-[#a78bfa] rounded-md text-sm outline-none focus:ring-2 focus:ring-[#a78bfa]"
        placeholder="한줄소개를 작성해주세요."
        value={intro}
        onChange={(e) => setIntro(e.target.value)}
      />
      <div className="mt-4 flex gap-4">
        <button
          className="bg-[#D7E8F7] hover:bg-[#c2dcf4] text-black px-4 py-2 rounded-xl"
          onClick={handleSaveIntro}
        >
          저장하기
        </button>
        <button
          className="bg-[#EDEDED] hover:bg-[#dcdcdc] text-black px-4 py-2 rounded-xl"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>

      <button
        className="absolute bottom-12 right-12 px-4 py-2 bg-[#F4DADA] hover:bg-[#e9cfcf] text-black rounded-xl"
        onClick={handleDeleteAccount}
      >
        탈퇴하기
      </button>
    </section>
  );
}
