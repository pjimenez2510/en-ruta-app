"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus, Search } from "lucide-react";
import { useCrearCliente } from "@/features/sell-tickets/hooks/use-crear-cliente";
import { useSRIData } from "@/features/sell-tickets/hooks/use-sri-data";

interface CrearClienteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClienteCreado: (cliente: any) => void;
}

export function CrearClienteModal({
  open,
  onOpenChange,
  onClienteCreado,
}: CrearClienteModalProps) {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    tipoDocumento: "CEDULA",
    numeroDocumento: "",
    telefono: "",
    email: "",
    fechaNacimiento: "",
    esDiscapacitado: false,
    porcentajeDiscapacidad: "",
  });

  const crearClienteMutation = useCrearCliente();
  const sriDataMutation = useSRIData();

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const buscarEnSRI = async () => {
    if (!formData.numeroDocumento || formData.tipoDocumento !== "CEDULA") {
      return;
    }

    try {
      const nombreCompleto = await sriDataMutation.mutateAsync(
        formData.numeroDocumento
      );

      // Extraer nombres y apellidos del nombre comercial (igual que en usuarios)
      const partes = nombreCompleto.split(" ");
      const apellidos = partes.slice(0, 2).join(" ");
      const nombres = partes.slice(2).join(" ");

      setFormData((prev) => ({
        ...prev,
        nombres,
        apellidos,
      }));
    } catch (error) {
      console.error("Error al buscar en SRI:", error);
    }
  };

  const crearCliente = async () => {
    const clienteData = {
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      tipoDocumento: formData.tipoDocumento,
      numeroDocumento: formData.numeroDocumento,
      telefono: formData.telefono,
      email: formData.email,
      fechaNacimiento: formData.fechaNacimiento || undefined,
      esDiscapacitado: formData.esDiscapacitado,
      porcentajeDiscapacidad: formData.porcentajeDiscapacidad
        ? parseFloat(formData.porcentajeDiscapacidad)
        : undefined,
    };

    try {
      const nuevoCliente = await crearClienteMutation.mutateAsync(clienteData);

      const clienteAdaptado = {
        id: nuevoCliente.id,
        nombre: `${nuevoCliente.nombres} ${nuevoCliente.apellidos}`,
        documento: nuevoCliente.numeroDocumento,
        email: nuevoCliente.email,
        telefono: nuevoCliente.telefono,
        esDiscapacitado: nuevoCliente.esDiscapacitado,
        fechaNacimiento: nuevoCliente.fechaNacimiento,
      };

      onClienteCreado(clienteAdaptado);

      setFormData({
        nombres: "",
        apellidos: "",
        tipoDocumento: "CEDULA",
        numeroDocumento: "",
        telefono: "",
        email: "",
        fechaNacimiento: "",
        esDiscapacitado: false,
        porcentajeDiscapacidad: "",
      });
    } catch (error) {
      console.error("Error al crear cliente:", error);
    }
  };

  const esFormularioValido = () => {
    return (
      formData.nombres &&
      formData.apellidos &&
      formData.numeroDocumento &&
      formData.telefono &&
      formData.email
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Crear Nuevo Cliente
          </DialogTitle>
          <DialogDescription>
            Complete la información del nuevo cliente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información Personal</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombres">Nombres *</Label>
                <Input
                  id="nombres"
                  placeholder="Ej: Juan Carlos"
                  value={formData.nombres}
                  onChange={(e) => handleInputChange("nombres", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos *</Label>
                <Input
                  id="apellidos"
                  placeholder="Ej: Pérez González"
                  value={formData.apellidos}
                  onChange={(e) =>
                    handleInputChange("apellidos", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Documento *</Label>
                <Select
                  value={formData.tipoDocumento}
                  onValueChange={(value) =>
                    handleInputChange("tipoDocumento", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CEDULA">Cédula</SelectItem>
                    <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroDocumento">Número de Documento *</Label>
                <div className="flex gap-2">
                  <Input
                    id="numeroDocumento"
                    placeholder="Ej: 1712345678"
                    value={formData.numeroDocumento}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 13) {
                        handleInputChange("numeroDocumento", value);
                      }
                    }}
                  />
                  {formData.tipoDocumento === "CEDULA" && (
                    <Button
                      type="button"
                      size="icon"
                      onClick={buscarEnSRI}
                      disabled={
                        (formData.numeroDocumento.length !== 10 &&
                          formData.numeroDocumento.length !== 13) ||
                        sriDataMutation.isPending
                      }
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
              <Input
                id="fechaNacimiento"
                type="date"
                value={formData.fechaNacimiento}
                onChange={(e) =>
                  handleInputChange("fechaNacimiento", e.target.value)
                }
              />
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información de Contacto</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  placeholder="Ej: +593987654321"
                  value={formData.telefono}
                  onChange={(e) =>
                    handleInputChange("telefono", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ej: cliente@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Información Especial */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información Especial</h3>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="esDiscapacitado"
                checked={formData.esDiscapacitado}
                onCheckedChange={(checked) =>
                  handleInputChange("esDiscapacitado", checked)
                }
              />
              <Label htmlFor="esDiscapacitado">
                El cliente tiene alguna discapacidad
              </Label>
            </div>

            {formData.esDiscapacitado && (
              <div className="space-y-2">
                <Label htmlFor="porcentajeDiscapacidad">
                  Porcentaje de Discapacidad (%)
                </Label>
                <Input
                  id="porcentajeDiscapacidad"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="Ej: 30.5"
                  value={formData.porcentajeDiscapacidad}
                  onChange={(e) =>
                    handleInputChange("porcentajeDiscapacidad", e.target.value)
                  }
                />
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              onClick={crearCliente}
              disabled={!esFormularioValido() || crearClienteMutation.isPending}
            >
              {crearClienteMutation.isPending ? "Creando..." : "Crear Cliente"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
