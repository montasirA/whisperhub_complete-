import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="min-h-screen bg-[var(--page-gradient)] p-4 sm:p-6">
            <div className="mx-auto flex w-full max-w-[1600px] gap-4">

                {/* DESKTOP SIDEBAR */}
                <Sidebar />

                {/* MAIN AREA */}
                <div className="min-w-0 flex-1">

                    {/* MOBILE TOPBAR */}
                    <Topbar />

                    {/* PAGE CONTENT */}
                    <div className="mt-4 lg:mt-0">
                        {children}
                    </div>

                </div>
            </div>
        </main>
    );
}
