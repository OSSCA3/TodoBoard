import React from 'react';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        {children}
      </div>
    </div>
  );
}
