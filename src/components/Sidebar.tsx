'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getSessionClient } from '@/libs/supabase/get-session-client';

const navItems = [
  { href: '/home', icon: '/icons/home.png', label: '홈' },
  { href: '/todo', icon: '/icons/todo.png', label: '할 일' },
  { href: '/user', icon: '/icons/setting.png', label: '사용자 설정' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const session = await getSessionClient();
      const avatar = session?.user?.user_metadata?.avatar_url;
      setAvatarUrl(avatar ?? null);
    })();
  }, []);

  return (
    <aside className="fixed left-0 top-0 h-full w-16 bg-purple-200 flex flex-col items-center py-4 gap-6 z-50">
      {/* 프로필 자리*/}
      <div className="w-10 h-10 bg-white rounded-md overflow-hidden">
        {avatarUrl && (
          <Image
            src={avatarUrl}
            alt="User Profile"
            width={40}
            height={40}
            className="rounded-md"
          />
        )}
      </div>

      {/* 네비게이션 버튼 */}
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`w-10 h-10 rounded-md flex items-center justify-center transition ${
            pathname === item.href ? 'bg-purple-400' : 'hover:bg-purple-300'
          }`}
        >
          <Image src={item.icon} alt={item.label} width={24} height={24} />
        </Link>
      ))}
    </aside>
  );
}
