import { Home, Users, Bus, Clock, LogOut } from "lucide-react";

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

type Props = {
  role?: "admin" | "user";
};

export function AppSidebar({ role = "user" }: Props) {
  // Define menu items based on role
  const menuItems =
    role === "admin"
      ? [
          { title: "Inicio", path: "/", icon: Home },
          { title: "Usuarios", path: "/usuarios", icon: Users },
          { title: "Cooperativas", path: "/cooperativas", icon: Bus },
          { title: "Frecuencias", path: "/frecuencias", icon: Clock },
        ]
      : [{ title: "Inicio", path: "/", icon: Home }];

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
                  <button className="flex w-full items-center gap-2 text-red-500 hover:text-red-600">
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar Sesión</span>
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
