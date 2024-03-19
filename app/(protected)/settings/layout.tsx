import SettingsNavbar from "./_components/navbar";
import { RxCross2 } from "react-icons/rx";

export default async function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex gap-24 p-16 h-full">
      <SettingsNavbar />
      <button className="absolute right-16 top-6 text-secondary-light-gray">
        <RxCross2 size={32} />
      </button>
      <div className="flex-1 h-full border rounded-md border-divider p-6">
        {children}
      </div>
    </div>
  );
}
