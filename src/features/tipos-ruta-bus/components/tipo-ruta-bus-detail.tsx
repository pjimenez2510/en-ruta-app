"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Edit, 
  Bus,
  Loader2 
} from "lucide-react";
import Link from "next/link";
import { useFindTipoRutaBusByIdQuery } from "../hooks/use-tipo-ruta-bus-queries";

interface TipoRutaBusDetailProps {
  tipoRutaBusId: number;
}

export function TipoRutaBusDetail({ tipoRutaBusId }: TipoRutaBusDetailProps) {
  const { data: tipoRutaBus, isLoading, error } = useFindTipoRutaBusByIdQuery(tipoRutaBusId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando información del tipo de ruta...</span>
      </div>
    );
  }

  if (error || !tipoRutaBus) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Error al cargar la información del tipo de ruta</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/main/tipos-ruta-bus">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{tipoRutaBus.nombre}</h1>
            <p className="text-muted-foreground">
              Información detallada del tipo de ruta de bus
            </p>
          </div>
        </div>
        <Link href={`/main/tipos-ruta-bus/${tipoRutaBusId}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Editar Tipo de Ruta
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Información del Tipo de Ruta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bus className="mr-2 h-5 w-5" />
              Información del Tipo de Ruta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nombre</label>
              <p className="text-sm font-medium">{tipoRutaBus.nombre}</p>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">ID</label>
              <p className="text-sm">{tipoRutaBus.id}</p>
            </div>
          </CardContent>
        </Card>

        {/* Información Adicional */}
        <Card>
          <CardHeader>
            <CardTitle>Información Adicional</CardTitle>
            <CardDescription>
              Detalles adicionales sobre este tipo de ruta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Descripción</label>
              <p className="text-sm text-muted-foreground">
                Este tipo de ruta define la categoría y características específicas 
                que tendrán las rutas asociadas a este tipo.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Uso</label>
              <p className="text-sm text-muted-foreground">
                Los tipos de ruta se utilizan para categorizar y organizar las diferentes 
                rutas de transporte según sus características y propósitos.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 