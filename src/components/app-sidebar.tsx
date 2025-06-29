"use client";

import {
  Bus,
  Users,
  LogOut,
  Settings,
  List,
  ChevronDown,
  ChartLine,
  FileText,
  Map,
  Plus,
  Ticket,
  CircleDollarSign,
  TicketPlus,
  PersonStanding,
  BanknoteArrowDown,
  Route,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/presentation/context/auth.store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { useTenantColors } from "@/core/context/tenant-context";
import Image from "next/image";

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
} from "@/components/ui/sidebar";

interface MenuItem {
  title: string;
  path?: string;
  icon?: React.ElementType;
  children?: MenuItem[];
}

export function AppSidebar() {
  const router = useRouter();
  const userRole = useAuthStore((state) => state.userRole);
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const { logoUrl } = useTenantColors();

  const menuItems: MenuItem[] =
    userRole === "OFICINISTA"
      ? [
          {
            title: "Unidades",
            icon: Bus,
            children: [
              {
                title: "Buses",
                children: [
                  { title: "Agregar Bus", path: "/main/buses/add", icon: Plus },
                  { title: "Mis Buses", path: "/main/buses", icon: List },
                ],
              },
              {
                title: "Asientos",
                children: [
                  {
                    title: "Tipos de Asientos",
                    path: "/main/seating/types",
                    icon: Bus,
                  },
                ],
              },
            ],
          },
          {
            title: "Tickets",
            icon: Ticket,
            children: [
              {
                title: "Ventas",
                path: "/main/tickets/sell",
                icon: CircleDollarSign,
              },
              {
                title: "Nueva Venta",
                path: "/main/tickets/sell/new",
                icon: TicketPlus,
              },
            ],
          },
          { title: "Resoluciones", path: "/main/resolution", icon: FileText },
          { title: "Rutas", path: "/main/routes", icon: Map },
          { title: "Viajes", path: "/main/trips", icon: List },
        ]
      : [
          { title: "Dashboard", path: "/main/dashboard", icon: ChartLine },
          { title: "Usuarios", path: "/main/user-tenant", icon: Users },
          {
            title: "Unidades",
            icon: Bus,
            children: [
              {
                title: "Buses",
                children: [
                  { title: "Agregar Bus", path: "/main/buses/add", icon: Plus },
                  { title: "Mis Buses", path: "/main/buses", icon: List },
                ],
              },
              {
                title: "Asientos",
                children: [
                  {
                    title: "Tipos de Asientos",
                    path: "/main/seating/types",
                    icon: Bus,
                  },
                ],
              },
            ],
          },
          {
            title: "Tickets",
            icon: Ticket,
            children: [
              {
                title: "Ventas",
                path: "/main/tickets/sell",
                icon: CircleDollarSign,
              },
              {
                title: "Nueva Venta",
                path: "/main/tickets/sell/new",
                icon: TicketPlus,
              },
            ],
          },
          { title: "Resoluciones", path: "/main/resolution", icon: FileText },
          { title: "Rutas", path: "/main/routes", icon: Map },
          { title: "Viajes", path: "/main/trips", icon: List },
          {
            title: "Configuración",
            path: "/main/configuration",
            icon: Settings,
          },
          {
            title: "Clientes",
            path: "/main/clientes",
            icon: PersonStanding,
          },
          {
            title: "Configuración de descuentos",
            path: "/main/configuracion-descuentos",
            icon: BanknoteArrowDown,
          },
          {
            title: "Tipos de rutas-buses",
            path: "/main/tipos-ruta-bus",
            icon: Route,
          },
        ];

  const handleToggle = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false, callbackUrl: "/login" });
      useAuthStore.getState().logout();
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  useEffect(() => {
    if (!userRole) return;
    if (userRole === "ADMIN_SISTEMA") router.push("/main/admin/dashboard");
    else if (userRole === "CLIENTE") router.push("/cliente/dashboard");
    else if (userRole === "OFICINISTA") router.push("/main/tickets/sell");
  }, [userRole, router]);

  if (userRole === "OFICINISTA") return null;

  const renderMenu = (items: MenuItem[], depth = 0) =>
    items.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isOpen = openMenus.includes(item.title);
      return (
        <SidebarMenuItem key={item.title} className={`pl-${depth * 2}`}>
          {hasChildren ? (
            <SidebarMenuButton
              className="flex justify-between items-center w-full"
              onClick={() => handleToggle(item.title)}
            >
              <div className="flex items-center gap-2">
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.title}</span>
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </SidebarMenuButton>
          ) : (
            <SidebarMenuButton asChild>
              <Link href={item.path!} className="flex items-center gap-2">
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          )}
          {hasChildren && isOpen && (
            <SidebarMenu className="ml-2">
              {renderMenu(item.children!, depth + 1)}
            </SidebarMenu>
          )}
        </SidebarMenuItem>
      );
    });

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-4">
          <div className="flex items-center gap-2">
            {logoUrl && (
              <Image
                src={logoUrl}
                alt="Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <div className="text-lg font-bold">EnRuta</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{renderMenu(menuItems)}</SidebarMenu>
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
