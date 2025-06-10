"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger,} from "@/shared/components/ui/sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full p-4">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
