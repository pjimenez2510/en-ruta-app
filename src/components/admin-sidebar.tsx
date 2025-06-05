"use client";
import {
  Users,
  Building2,
  Settings,
  LogOut,
  Shield,
  Bus,
  UserCog,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/presentation/context/auth.store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/shared/components/ui/sidebar";

export function AdminSidebar() {
  const router = useRouter();
  const userRole = useAuthStore((state) => state.userRole);

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: false,
        callbackUrl: "/login",
      });
      useAuthStore.getState().logout();
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  useEffect(() => {
    if (!userRole) return;

    if (userRole === "ADMIN_SISTEMA") {
      return;
    } else if (userRole === "PERSONAL_COOPERATIVA") {
      router.push("/main/dashboard");
    } else if (userRole === "CLIENTE") {
      router.push("/cliente/dashboard");
    } else {
      router.push("/unauthorized");
    }
  }, [userRole, router]);

  if (userRole !== "ADMIN_SISTEMA") return null;

  const menuItems = [
    {
      title: "Dashboard",
      path: "/main/admin/dashboard",
      icon: Shield,
      description: "Panel de control del sistema",
    },
    {
      title: "Cooperativas",
      path: "/main/admin/cooperativas",
      icon: Building2,
      description: "Gestión de cooperativas",
    },
    {
      title: "Usuarios",
      path: "/main/admin/usuarios",
      icon: Users,
      description: "Administración de usuarios",
    },
    {
      title: "Roles",
      path: "/main/admin/roles",
      icon: UserCog,
      description: "Gestión de roles y permisos",
    },
    {
      title: "Rutas",
      path: "/main/admin/rutas",
      icon: Bus,
      description: "Administración de rutas",
    },
    {
      title: "Configuración",
      path: "/main/admin/configuracion",
      icon: Settings,
      description: "Configuración del sistema",
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-4">
          <div className="text-lg font-bold">EnRuta</div>
          <div className="text-sm text-muted-foreground">
            Panel de Administración
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.path}
                      className="flex items-center gap-2 group"
                      title={item.description}
                    >
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
