"use client";
import { Users, MapPinned, Clock, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { useAuthStore } from "@/features/auth/presentation/context/auth.store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter,} from "@/shared/components/ui/sidebar";

export function AppSidebar() {
  const router = useRouter();
  const userRole = useAuthStore((state) => state.userRole);

  const handleLogout = async () => {
    try {
      // Primero cerramos la sesión de NextAuth
      await signOut({
        redirect: false,
        callbackUrl: "/login",
      });

      // Luego limpiamos el estado local
      useAuthStore.getState().logout();

      // Finalmente redirigimos al login
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  useEffect(() => {
    // Redirigir basado en el rol
    if (!userRole) return; // Esperar a que el rol esté disponible

    if (userRole === "PERSONAL_COOPERATIVA") {
      // Ya estamos en la vista correcta, no hacer nada
      return;
    } else if (userRole === "ADMIN_SISTEMA") {
      router.push("/main/admin/dashboard");
    } else if (userRole === "CLIENTE") {
      router.push("/cliente/dashboard");
    } else {
      // Para cualquier otro rol no manejado
      router.push("/unauthorized");
    }
  }, [userRole, router]);

  // Si no es PERSONAL_COOPERATIVA, no mostrar el sidebar
  if (userRole !== "PERSONAL_COOPERATIVA") return null;

  const menuItems = [
    { title: "Dashboard", path: "/main/dashboard", icon: LayoutDashboard },
    { title: "Usuarios", path: "/main/users", icon: Users },
    { title: "---", path: "/main/frequencies", icon: Clock },
    { title: "Rutas", path: "/main/routes", icon: MapPinned },
    { title: "Frecuencias", path: "/main/frequencies", icon: Clock },
    { title: "Configuración", path: "/main/configuration", icon: Settings },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-4 text-lg font-bold">EnRuta</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.path} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    className="flex items-center gap-2 w-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
