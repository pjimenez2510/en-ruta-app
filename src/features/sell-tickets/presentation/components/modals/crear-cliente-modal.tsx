"use client";

import { useState, useEffect } from "react";
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
import { UserPlus, Search, AlertTriangle } from "lucide-react";
import { useCrearCliente } from "@/features/sell-tickets/hooks/use-crear-cliente";
import { useSRIData } from "@/features/sell-tickets/hooks/use-sri-data";
import { useValidarDocumento } from "@/features/sell-tickets/hooks/use-validar-documento";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CrearClienteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClienteCreado: (cliente: any) => void;
}

// Funciones de validación
const validarTelefono = (telefono: string): boolean => {
  // Permite + al inicio y solo números después
  const regex = /^\+?[0-9]+$/;
  return regex.test(telefono) && telefono.length >= 10;
};

const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validarPorcentaje = (porcentaje: string): boolean => {
  const num = parseFloat(porcentaje);
  return !isNaN(num) && num >= 0 && num <= 100;
};

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

  const [errores, setErrores] = useState<Record<string, string>>({});

  const crearClienteMutation = useCrearCliente();
  const sriDataMutation = useSRIData();
  const validacionDocumento = useValidarDocumento(formData.numeroDocumento);

  // Verificar si ya existe un cliente con ese documento
  const clienteExistente =
    validacionDocumento.data && validacionDocumento.data.length > 0
      ? validacionDocumento.data[0]
      : null;

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Validar el campo inmediatamente cuando cambia
    const error = validarCampo(field, value);
    setErrores((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const validarCampo = (field: string, value: string): string => {
    switch (field) {
      case "numeroDocumento":
        if (!value) return "El número de documento es requerido";
        if (value.length < 10)
          return "El documento debe tener al menos 10 dígitos";
        if (clienteExistente)
          return "Ya existe un cliente con este número de documento";
        return "";

      case "telefono":
        if (!value) return "El teléfono es requerido";
        if (!validarTelefono(value))
          return "El teléfono debe tener al menos 10 dígitos y solo puede contener números y + al inicio";
        return "";

      case "email":
        if (!value) return "El email es requerido";
        if (!validarEmail(value))
          return "El email debe tener un formato válido";
        return "";

      case "porcentajeDiscapacidad":
        if (formData.esDiscapacitado && !value)
          return "El porcentaje es requerido cuando hay discapacidad";
        if (value && !validarPorcentaje(value))
          return "El porcentaje debe estar entre 0 y 100";
        return "";

      default:
        return "";
    }
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
    // Validar todos los campos antes de enviar
    const nuevosErrores: Record<string, string> = {};

    const camposAValidar = ["numeroDocumento", "telefono", "email"];
    if (formData.esDiscapacitado) {
      camposAValidar.push("porcentajeDiscapacidad");
    }

    camposAValidar.forEach((campo) => {
      const error = validarCampo(
        campo,
        formData[campo as keyof typeof formData] as string
      );
      if (error) {
        nuevosErrores[campo] = error;
      }
    });

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

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

      // Limpiar formulario y errores
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
      setErrores({});
    } catch (error) {
      console.error("Error al crear cliente:", error);
    }
  };

  const esFormularioValido = () => {
    // Verificar que todos los campos requeridos estén llenos
    const camposRequeridos =
      formData.nombres &&
      formData.apellidos &&
      formData.numeroDocumento &&
      formData.telefono &&
      formData.email;

    // Verificar que no haya errores activos
    const sinErrores = Object.values(errores).every((error) => error === "");

    // Verificar que no haya cliente existente
    const sinClienteExistente = !clienteExistente;

    return camposRequeridos && sinErrores && sinClienteExistente;
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
          {/* Alerta de cliente existente */}
          {clienteExistente && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                Ya existe un cliente con el número de documento{" "}
                {formData.numeroDocumento}:{" "}
                <strong>
                  {clienteExistente.nombres} {clienteExistente.apellidos}
                </strong>
              </AlertDescription>
            </Alert>
          )}

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
                    className={errores.numeroDocumento ? "border-red-500" : ""}
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
                {errores.numeroDocumento && (
                  <p className="text-sm text-red-500">
                    {errores.numeroDocumento}
                  </p>
                )}
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
                  onChange={(e) => {
                    const value = e.target.value;
                    // Permitir solo + al inicio y números
                    if (value === "" || /^\+?[0-9]*$/.test(value)) {
                      handleInputChange("telefono", value);
                    }
                  }}
                  className={errores.telefono ? "border-red-500" : ""}
                />
                {errores.telefono && (
                  <p className="text-sm text-red-500">{errores.telefono}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ej: cliente@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errores.email ? "border-red-500" : ""}
                />
                {errores.email && (
                  <p className="text-sm text-red-500">{errores.email}</p>
                )}
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
                  Porcentaje de Discapacidad (%) *
                </Label>
                <Input
                  id="porcentajeDiscapacidad"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="Ej: 30.5"
                  value={formData.porcentajeDiscapacidad}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Permitir solo números y punto decimal
                    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
                      handleInputChange("porcentajeDiscapacidad", value);
                    }
                  }}
                  className={
                    errores.porcentajeDiscapacidad ? "border-red-500" : ""
                  }
                />
                {errores.porcentajeDiscapacidad && (
                  <p className="text-sm text-red-500">
                    {errores.porcentajeDiscapacidad}
                  </p>
                )}
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
