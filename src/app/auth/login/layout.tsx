export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="h-screen w-screen bg-[#f3edff] flex items-center justify-center">
        {children}
      </body>
    </html>
  );
}
