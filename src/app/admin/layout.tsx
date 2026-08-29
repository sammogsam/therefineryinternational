import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar - Hidden on mobile, sticky sidebar on desktop */}
      <div className="hidden md:block md:w-64 md:shrink-0">
        <div className="fixed inset-y-0 z-30 w-64">
          <Sidebar />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <Header />

        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>

    </div>
  );
}