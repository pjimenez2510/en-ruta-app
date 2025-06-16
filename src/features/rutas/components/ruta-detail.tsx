// features/rutas/components/ruta-detail.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  ExternalLink, 
  MapPin, 
  FileText, 
  Calendar,
  Building2,
  Loader2 
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { useFindRutaByIdQuery } from "../hooks/use-ruta-queries";

interface RutaDetailProps {
  rutaId: number;
}

export function RutaDetail({ rutaId }: RutaDetailProps) {
  const { data: ruta, isLoading, error } = useFindRutaByIdQuery(rutaId);

  const openDocument = (url: string) => {
    window.open(url, "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando información de la ruta...</span>
      </div>
    );
  }

  if (error || !ruta) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Error al cargar la información de la ruta</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/main/routes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{ruta.nombre}</h1>
            <p className="text-muted-foreground">
              Información detallada de la ruta
            </p>
          </div>
        </div>
        <Link href={`/main/routes/${rutaId}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Editar Ruta
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Información de la Ruta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Información de la Ruta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nombre</label>
              <p className="text-sm font-medium">{ruta.nombre}</p>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Descripción</label>
              <p className="text-sm">{ruta.descripcion}</p>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Estado</label>
              <div className="mt-1">
                <Badge variant={ruta.activo ? "default" : "secondary"}>
                  {ruta.activo ? "Activa" : "Inactiva"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de la Cooperativa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="mr-2 h-5 w-5" />
              Cooperativa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nombre</label>
              <p className="text-sm font-medium">{ruta.tenant?.nombre}</p>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">ID de Cooperativa</label>
              <p className="text-sm">{ruta.tenantId}</p>
            </div>
          </CardContent>
        </Card>

        {/* Información de la Resolución ANT */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Resolución ANT
            </CardTitle>
            <CardDescription>
              Información de la resolución que ampara esta ruta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Número de Resolución</label>
                <p className="text-sm font-medium">{ruta.resolucion?.numeroResolucion}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Estado</label>
                <div className="mt-1">
                  <Badge variant={ruta.resolucion?.activo ? "default" : "secondary"}>
                    {ruta.resolucion?.activo ? "Vigente" : "No Vigente"}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Fecha de Emisión</label>
                <p className="text-sm flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {format(new Date(ruta.resolucion?.fechaEmision), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Fecha de Vigencia</label>
                <p className="text-sm flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {format(new Date(ruta.resolucion?.fechaVigencia), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Descripción</label>
              <p className="text-sm">{ruta.resolucion?.descripcion}</p>
            </div>
            
            {ruta.resolucion?.documentoUrl && (
              <>
                <Separator />
                <div>
                  <Button
                    variant="outline"
                    onClick={() => openDocument(ruta.resolucion.documentoUrl)}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ver Documento de Resolución
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}