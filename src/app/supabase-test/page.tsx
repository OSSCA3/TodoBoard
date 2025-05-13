// src/app/supabase-test/page.tsx
// supabase 연동 테스트를 위해 임시로 생성한 페이지입니다.

'use client';

import { useEffect, useState } from 'react';
import { createClientInstance } from '@/libs/supabase/client'; // CSR 전용 클라이언트
import { Instrument } from '@/types/instrument';
const SupabaseTestPage = () => {
  const [data, setData] = useState<Instrument[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClientInstance();
      const { data, error } = await supabase.from('instruments').select();

      if (error) setError(error.message);
      else setData(data);
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>✅ Supabase 연결 확인</h1>
      {error && <p style={{ color: 'red' }}>❌ 에러: {error}</p>}
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>⏳ 데이터를 불러오는 중...</p>
      )}
    </div>
  );
};

export default SupabaseTestPage;
