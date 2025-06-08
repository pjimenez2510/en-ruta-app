"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { SeatType } from "../interfaces/seat-type.interface";
import { Pencil, Trash2 } from "lucide-react";

interface SeatTypeTableProps {
  seatTypes: SeatType[];
  onEdit: (seatType: SeatType) => void;
  onDelete: (id: number) => void;
}

export const SeatTypeTable = ({ seatTypes, onEdit, onDelete }: SeatTypeTableProps) => {
  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="px-4 py-3">Nombre</TableHead>
            <TableHead className="px-4 py-3">Descripción</TableHead>
            <TableHead className="px-4 py-3">Precio Adicional</TableHead>
            <TableHead className="px-4 py-3">Color</TableHead>
            <TableHead className="px-4 py-3">Icono</TableHead>
            <TableHead className="px-4 py-3">Estado</TableHead>
            <TableHead className="px-4 py-3 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {seatTypes.map((seatType) => (
            <TableRow key={seatType.id} className="hover:bg-gray-50 transition">
              <TableCell className="px-4 py-3">{seatType.nombre}</TableCell>
              <TableCell className="px-4 py-3">{seatType.descripcion}</TableCell>
              <TableCell className="px-4 py-3">
                ${seatType.factorPrecio}
              </TableCell>
              <TableCell className="px-4 py-3">
                <span
                  className="inline-block w-6 h-6 rounded-full border"
                  style={{ backgroundColor: seatType.color }}
                  title={seatType.color}
                />
              </TableCell>
              <TableCell className="px-4 py-3">{seatType.icono}</TableCell>
              <TableCell className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    seatType.activo
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {seatType.activo ? "Activo" : "Inactivo"}
                </span>
              </TableCell>
              <TableCell className="px-4 py-3 text-right space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(seatType)}
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => onDelete(seatType.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}; 