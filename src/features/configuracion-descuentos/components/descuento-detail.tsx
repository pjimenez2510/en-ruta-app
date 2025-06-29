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
  Percent,
  Shield,
  CheckCircle,
  XCircle,
  Loader2 
} from "lucide-react";
import Link from "next/link";
import { useFindDescuentoByIdQuery } from "../hooks/use-descuento-queries";

interface DescuentoDetailProps {
  descuentoId: number;
}

export function DescuentoDetail({ descuentoId }: DescuentoDetailProps) {
  const { data: descuento, isLoading, error } = useFindDescuentoByIdQuery(descuentoId);

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case "MENOR_EDAD":
        return "Menor de Edad";
      case "TERCERA_EDAD":
        return "Tercera Edad";
      case "DISCAPACIDAD":
        return "Discapacidad";
      default:
        return tipo;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "MENOR_EDAD":
        return "👶";
      case "TERCERA_EDAD":
        return "👴";
      case "DISCAPACIDAD":
        return "♿";
      default:
        return "💰";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando información del descuento...</span>
      </div>
    );
  }

  if (error || !descuento) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Error al cargar la información del descuento</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/main/configuracion-descuentos">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {getTipoIcon(descuento.tipo)} {getTipoLabel(descuento.tipo)}
            </h1>
            <p className="text-muted-foreground">
              Información detallada de la configuración de descuento
            </p>
          </div>
        </div>
        <Link href={`/main/configuracion-descuentos/${descuentoId}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Editar Descuento
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Información del Descuento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Percent className="mr-2 h-5 w-5" />
              Información del Descuento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tipo de Descuento</label>
              <div className="flex items-center mt-1">
                <span className="text-2xl mr-2">{getTipoIcon(descuento.tipo)}</span>
                <p className="text-sm font-medium">{getTipoLabel(descuento.tipo)}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Porcentaje de Descuento</label>
              <div className="flex items-center mt-1">
                <Percent className="mr-2 h-4 w-4" />
                <p className="text-sm font-medium">{descuento.porcentaje}%</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Estado</label>
              <div className="mt-1">
                <Badge variant={descuento.activo ? "default" : "secondary"}>
                  {descuento.activo ? (
                    <>
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Activo
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-1 h-3 w-3" />
                      Inactivo
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Validación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Configuración de Validación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Requiere Validación</label>
              <div className="mt-1">
                <Badge variant={descuento.requiereValidacion ? "default" : "secondary"}>
                  {descuento.requiereValidacion ? (
                    <>
                      <Shield className="mr-1 h-3 w-3" />
                      Sí requiere validación
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-1 h-3 w-3" />
                      No requiere validación
                    </>
                  )}
                </Badge>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">ID de Cooperativa</label>
              <p className="text-sm">{descuento.tenantId}</p>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">ID de Configuración</label>
              <p className="text-sm">{descuento.id}</p>
            </div>
          </CardContent>
        </Card>

        {/* Información Adicional */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Información Adicional
            </CardTitle>
            <CardDescription>
              Detalles sobre la aplicación de este descuento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Aplicación Automática</h4>
                <p className="text-sm text-muted-foreground">
                  {descuento.requiereValidacion 
                    ? "Este descuento requiere validación manual por parte del personal autorizado antes de ser aplicado."
                    : "Este descuento se aplica automáticamente cuando se cumplen las condiciones establecidas."
                  }
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Condiciones de Aplicación</h4>
                <p className="text-sm text-muted-foreground">
                  {descuento.tipo === "MENOR_EDAD" && "Se aplica a pasajeros menores de 18 años."}
                  {descuento.tipo === "TERCERA_EDAD" && "Se aplica a pasajeros mayores de 65 años."}
                  {descuento.tipo === "DISCAPACIDAD" && "Se aplica a pasajeros con discapacidad verificada."}
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2">Notas Importantes</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• El descuento se calcula sobre el precio base del boleto</li>
                <li>• Solo se puede aplicar un descuento por boleto</li>
                <li>• Los descuentos inactivos no se aplican en nuevas ventas</li>
                {descuento.requiereValidacion && (
                  <li>• Se requiere documentación de respaldo para validar el descuento</li>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 