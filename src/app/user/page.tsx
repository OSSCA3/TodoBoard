'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/libs/supabase/client';
import { getSessionClient } from '@/libs/supabase/get-session-client';
import { updateIntro } from '@/libs/supabase/update-intro';
import { toast } from 'react-hot-toast';

export default function UserPage() {
  const [intro, setIntro] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  // 사용자 세션 가져오기 및 intro 초기값 불러오기
  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
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
  }, []);

  // 한줄소개 저장
  const handleSaveIntro = async () => {
    try {
      await updateIntro(intro);
      alert('한줄소개가 저장되었습니다.');
    } catch (error) {
      alert('저장 실패: ' + (error as Error).message);
    }
  };

  // 탈퇴하기
  const handleDeleteAccount = () => {
    toast(
      (t) => (
        <div className="text-sm">
          <p className="mb-2">정말 탈퇴하시겠습니까?</p>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id); // 토스트 닫기

                try {
                  const res = await fetch('/api/delete-user', {
                    method: 'POST',
                  });

                  if (res.ok) {
                    toast.success('탈퇴가 완료되었습니다.');
                    router.push('/auth/login');
                  } else {
                    const contentType = res.headers.get('content-type');
                    if (contentType?.includes('application/json')) {
                      const { error } = await res.json();
                      toast.error('탈퇴 실패: ' + error);
                    } else {
                      toast.error('탈퇴 처리 중 오류가 발생했습니다.');
                    }
                  }
                } catch (error) {
                  console.error('탈퇴 요청 실패:', error);
                  toast.error('네트워크 오류가 발생했습니다.');
                }
              }}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm"
            >
              확인
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
            >
              취소
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity, // 사용자가 직접 닫기 전까지 유지
      },
    );
  };

  // 로그아웃
  const handleLogout = async () => {
    const confirmed = confirm('정말 로그아웃하시겠습니까?');
    if (!confirmed) return;

    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert('로그아웃 실패: ' + error.message);
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <>
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

      <div className="mt-8 pt-8 border-t border-gray-200">
        <button
          className="px-4 py-2 bg-[#F4DADA] hover:bg-[#e9cfcf] text-black rounded-xl"
          onClick={handleDeleteAccount}
        >
          탈퇴하기
        </button>
      </div>
    </>
  );
}
