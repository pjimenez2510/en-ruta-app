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
import { Badge } from "@/components/ui/badge";
import { Search, User, Plus, UserPlus, X } from "lucide-react";
import { getClientesPorCedula } from "@/features/sell-tickets/services/clientes.service";
import { Cliente } from "@/features/sell-tickets/interfaces/cliente.interface";

interface ClienteAdaptado {
  id: number;
  nombre: string;
  documento: string;
  email: string;
  telefono: string;
  esDiscapacitado: boolean;
  fechaNacimiento: string;
}

interface BuscarClienteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClienteSeleccionado: (cliente: ClienteAdaptado, asientoId: number) => void;
  onCrearCliente: (asientoId: number) => void;
  asientoSeleccionado: {
    id: number;
    numero: string;
    tipo: string;
    precio: number;
  } | null;
}

// Función para calcular la edad a partir de la fecha de nacimiento
function calcularEdad(fechaNacimiento: string): number {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

function getEtiquetaEdad(fechaNacimiento: string): string {
  const edad = calcularEdad(fechaNacimiento);
  if (edad < 18) return "Niño";
  if (edad >= 65) return "Adulto mayor";
  return "Adulto";
}

export function BuscarClienteModal({
  open,
  onOpenChange,
  onClienteSeleccionado,
  onCrearCliente,
  asientoSeleccionado,
}: BuscarClienteModalProps) {
  const [cedula, setCedula] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [clientes, setClientes] = useState<ClienteAdaptado[]>([]);
  const [error, setError] = useState<string | null>(null);

  const buscarPorCedula = async () => {
    if (!cedula) return;
    setBuscando(true);
    setError(null);
    try {
      const clientesApi = await getClientesPorCedula(cedula);
      const clientesAdaptados = (clientesApi || []).map((c: Cliente) => ({
        id: c.id,
        nombre: `${c.nombres} ${c.apellidos}`,
        documento: c.numeroDocumento,
        email: c.email,
        telefono: c.telefono,
        esDiscapacitado: c.esDiscapacitado,
        fechaNacimiento: c.fechaNacimiento,
      }));
      setClientes(clientesAdaptados);
      if (clientesAdaptados.length === 0) {
        setError("No se encontró ningún cliente con esa cédula");
      }
    } catch {
      setError("Error al buscar cliente");
    } finally {
      setBuscando(false);
    }
  };

  const seleccionarCliente = (cliente: ClienteAdaptado) => {
    if (!asientoSeleccionado) return;
    onClienteSeleccionado(cliente, asientoSeleccionado.id);
    onOpenChange(false);
    setCedula("");
    setClientes([]);
    setError(null);
  };

  const handleCrearCliente = () => {
    if (!asientoSeleccionado) return;
    onCrearCliente(asientoSeleccionado.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Cliente
          </DialogTitle>
          <DialogDescription>
            {asientoSeleccionado
              ? `Seleccione un cliente para el asiento ${asientoSeleccionado.numero}`
              : "Busque por cédula o nombre del cliente"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del asiento */}
          {asientoSeleccionado && (
            <div className="p-4 border rounded-lg bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Asiento Seleccionado</h4>
                  <p className="text-sm text-muted-foreground">
                    {asientoSeleccionado.numero} - {asientoSeleccionado.tipo} -
                    ${asientoSeleccionado.precio}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Búsqueda */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Cédula</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ingrese cédula del cliente..."
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && buscarPorCedula()}
                />
                <Button
                  onClick={buscarPorCedula}
                  disabled={!cedula || buscando}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {clientes.length === 0 && cedula && !buscando && error && (
              <div className="text-center py-6 border rounded-lg bg-gray-50">
                <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={handleCrearCliente}>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Nuevo Cliente
                </Button>
              </div>
            )}
          </div>

          {/* Resultados */}
          {clientes.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Clientes Encontrados</h3>
                <Badge variant="secondary">{clientes.length} resultados</Badge>
              </div>

              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {clientes.map((cliente) => (
                  <div
                    key={cliente.id}
                    className="p-4 border rounded-lg hover:border-[#006D8B] cursor-pointer transition-colors"
                    onClick={() => seleccionarCliente(cliente)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{cliente.nombre}</span>
                          {cliente.fechaNacimiento && (
                            <Badge variant="secondary">
                              {getEtiquetaEdad(cliente.fechaNacimiento)}
                            </Badge>
                          )}
                          {cliente.esDiscapacitado && (
                            <Badge variant="secondary">Discapacidad</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Cédula: {cliente.documento}</p>
                          <p>Email: {cliente.email}</p>
                          <p>Teléfono: {cliente.telefono}</p>
                        </div>
                      </div>
                      <Button size="sm">Seleccionar</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Acción para crear cliente */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={handleCrearCliente}>
              <Plus className="mr-2 h-4 w-4" />
              Crear Nuevo Cliente
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
