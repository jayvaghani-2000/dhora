import { validateBusinessToken } from "@/actions/(auth)/validateBusiness";

export default async function BusinessLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await validateBusinessToken();

  return <>{children}</>;
}
