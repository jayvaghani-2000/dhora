import { validateBusinessToken } from "@/actions/(protected)/validateBusiness";

export default async function BusinessLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await validateBusinessToken();

  return <>{children}</>;
}
