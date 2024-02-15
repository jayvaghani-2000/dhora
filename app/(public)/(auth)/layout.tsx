export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="after:content-[''] after:absolute after:inset-0 after:bg-body-bg after:-z-10 relative min-h-screen min-w-screen flex justify-center items-center  bg-mix-gradient ">
      <section className="max-w-[100%] p-4 w-[600px] text-white">
        {children}
      </section>
    </main>
  );
}
