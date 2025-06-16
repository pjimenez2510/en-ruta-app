// features/resoluciones-ant/components/resolucion-ant-detail.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Edit,
  ExternalLink,
  FileText,
  Hash,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useFindResolucionAntByIdQuery } from "../hooks/use-resolucion-ant-queries";

interface ResolucionAntDetailProps {
  id: number;
}

export function ResolucionAntDetail({ id }: ResolucionAntDetailProps) {
  const router = useRouter();
  
  const { data: resolucion, isLoading, error } = useFindResolucionAntByIdQuery(id);

  const handleEdit = () => {
    router.push(`/admin/resoluciones-ant/${id}/edit`);
  };

  const handleBack = () => {
    router.push("/admin/resoluciones-ant");
  };

  const openDocument = () => {
    if (resolucion?.documentoUrl) {
      window.open(resolucion.documentoUrl, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2 text-muted-foreground">Cargando resolución...</p>
      </div>
    );
  }

  if (error || !resolucion) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <p className="text-destructive">Error al cargar la resolución</p>
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al listado
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{resolucion.numeroResolucion}</h1>
            <p className="text-muted-foreground">Detalle de la resolución ANT</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={openDocument}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Ver Documento
          </Button>
          <Button onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Información General</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Hash className="h-4 w-4" />
                    <span>Número de Resolución</span>
                  </div>
                  <p className="font-medium">{resolucion.numeroResolucion}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className="w-fit">
                      Estado
                    </Badge>
                  </div>
                  <Badge variant={resolucion.activo ? "default" : "secondary"}>
                    {resolucion.activo ? "Activa" : "Inactiva"}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Descripción</span>
                </div>
                <p className="text-sm leading-relaxed">{resolucion.descripcion}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ExternalLink className="h-5 w-5" />
                <span>Documento</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">URL del documento oficial</p>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-mono bg-muted px-2 py-1 rounded flex-1 truncate">
                    {resolucion.documentoUrl}
                  </p>
                  <Button size="sm" variant="outline" onClick={openDocument}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Fechas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Fecha de Emisión</p>
                <p className="font-medium">
                  {format(new Date(resolucion.fechaEmision), "dd 'de' MMMM 'de' yyyy", { 
                    locale: es 
                  })}
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Fecha de Vigencia</p>
                <p className="font-medium">
                  {format(new Date(resolucion.fechaVigencia), "dd 'de' MMMM 'de' yyyy", { 
                    locale: es 
                  })}
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Vigencia</p>
                <Badge 
                  variant={new Date(resolucion.fechaVigencia) > new Date() ? "default" : "destructive"}
                >
                  {new Date(resolucion.fechaVigencia) > new Date() ? "Vigente" : "Vencida"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ID de Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-2xl font-bold text-muted-foreground">
                #{resolucion.id}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}