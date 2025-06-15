"use client";

import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/presentation/context/auth.store";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const userRole = useAuthStore((state) => state.userRole);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (userRole !== "ADMIN_SISTEMA") {
      router.push("/unauthorized");
      return;
    }
  }, [session, status, userRole, router]);

  if (status === "loading") {
    return <div>Cargando...</div>;
  }

  if (!session || userRole !== "ADMIN_SISTEMA") {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="sticky top-0 z-10 bg-background p-4 shadow-sm">
            <SidebarTrigger />
          </div>
          <div className="p-4">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
