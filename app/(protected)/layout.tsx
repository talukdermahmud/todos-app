import Header from "../../components/Layout/Header";
import SideBar from "../../components/Layout/SideBar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6 bg-[#EEF7FF]">
          {children}
        </main>
      </div>
    </div>
  );
}
