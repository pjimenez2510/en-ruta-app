"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Users, Building2, Bus, UserCog } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Cooperativas",
      value: "5",
      description: "Cooperativas registradas",
      icon: Building2,
    },
    {
      title: "Usuarios",
      value: "150",
      description: "Usuarios activos",
      icon: Users,
    },
    {
      title: "Rutas",
      value: "25",
      description: "Rutas activas",
      icon: Bus,
    },
    {
      title: "Roles",
      value: "3",
      description: "Roles configurados",
      icon: UserCog,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <p className="text-muted-foreground">
          Bienvenido al panel de control del sistema
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Nueva cooperativa registrada
                  </p>
                  <p className="text-sm text-muted-foreground">Hace 2 horas</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Actualización de rutas
                  </p>
                  <p className="text-sm text-muted-foreground">Hace 5 horas</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Nuevo usuario registrado
                  </p>
                  <p className="text-sm text-muted-foreground">Hace 1 día</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Registrar Nueva Cooperativa
              </button>
              <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Crear Nueva Ruta
              </button>
              <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Gestionar Usuarios
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
