import { validateUserToken } from "@/actions/(auth)/validateUser";

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await validateUserToken();

  return <>{children}</>;
}
