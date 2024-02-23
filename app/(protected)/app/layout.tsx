import { validateUserToken } from "@/actions/(protected)/validateUser";

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await validateUserToken();

  return <>{children}</>;
}
