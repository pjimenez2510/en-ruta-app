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
  User, 
  Phone, 
  Mail, 
  Calendar,
  FileText,
  Loader2 
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { useFindClienteByIdQuery } from "../hooks/use-cliente-queries";

interface ClienteDetailProps {
  clienteId: number;
}

export function ClienteDetail({ clienteId }: ClienteDetailProps) {
  const { data: cliente, isLoading, error } = useFindClienteByIdQuery(clienteId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando información del cliente...</span>
      </div>
    );
  }

  if (error || !cliente) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Error al cargar la información del cliente</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/main/clientes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {cliente.nombres} {cliente.apellidos}
            </h1>
            <p className="text-muted-foreground">
              Información detallada del cliente
            </p>
          </div>
        </div>
        <Link href={`/main/clientes/${clienteId}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Editar Cliente
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Información Personal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nombres</label>
              <p className="text-sm font-medium">{cliente.nombres}</p>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Apellidos</label>
              <p className="text-sm font-medium">{cliente.apellidos}</p>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Fecha de Nacimiento</label>
              <p className="text-sm flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                {format(new Date(cliente.fechaNacimiento), "dd 'de' MMMM 'de' yyyy", { locale: es })}
              </p>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Estado</label>
              <div className="mt-1">
                <Badge variant={cliente.activo ? "default" : "secondary"}>
                  {cliente.activo ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de Contacto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="mr-2 h-5 w-5" />
              Información de Contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
              <p className="text-sm flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                {cliente.telefono}
              </p>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-sm flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                {cliente.email}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Información del Documento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Documento de Identidad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tipo de Documento</label>
              <p className="text-sm font-medium">{cliente.tipoDocumento}</p>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Número de Documento</label>
              <p className="text-sm font-medium">{cliente.numeroDocumento}</p>
            </div>
          </CardContent>
        </Card>

        {/* Información de Discapacidad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Información de Discapacidad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Estado de Discapacidad</label>
              <div className="mt-1">
                <Badge variant={cliente.esDiscapacitado ? "default" : "secondary"}>
                  {cliente.esDiscapacitado ? "Con Discapacidad" : "Sin Discapacidad"}
                </Badge>
              </div>
            </div>
            
            {cliente.esDiscapacitado && cliente.porcentajeDiscapacidad && (
              <>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Porcentaje de Discapacidad</label>
                  <p className="text-sm font-medium">{cliente.porcentajeDiscapacidad}%</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Información del Sistema */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Información del Sistema
            </CardTitle>
            <CardDescription>
              Fechas de registro y última actualización
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Fecha de Registro</label>
                <p className="text-sm flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {format(new Date(cliente.fechaRegistro), "dd 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Última Actualización</label>
                <p className="text-sm flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {format(new Date(cliente.ultimaActualizacion), "dd 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 