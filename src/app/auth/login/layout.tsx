import React from 'react';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen bg-[#f3edff] flex items-center justify-center">
      {children}
    </div>
  );
}
