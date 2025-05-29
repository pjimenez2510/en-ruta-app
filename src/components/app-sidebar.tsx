"use client";
import { Users, Bus, Clock, LogOut, Settings } from "lucide-react";
import { useAuthStore } from "@/features/auth/presentation/context/auth.store";

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
export function AppSidebar() {
  //const userRole = useAuthStore((state) => state.userRole);

  //if (userRole !== "PERSONAL_COOPERATIVA") return null;

  const menuItems = [
    { title: "Dashboard", path: "/main/dashboard", icon: Bus },
    { title: "Usuarios", path: "/main/usuarios", icon: Users },
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
                    onClick={() => {
                      useAuthStore.getState().logout();
                      window.location.href = "/login";
                    }}
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
