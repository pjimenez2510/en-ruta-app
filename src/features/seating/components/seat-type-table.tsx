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
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";

interface SeatTypeTableProps {
  seatTypes: SeatType[];
  onEdit: (seatType: SeatType) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const SeatTypeTable = ({ seatTypes, onEdit, onDelete }: SeatTypeTableProps) => {
  const [loadingStates, setLoadingStates] = useState<{[key: number]: boolean}>({});

  const handleAction = async (action: () => Promise<void>, seatTypeId: number) => {
    try {
      setLoadingStates(prev => ({ ...prev, [seatTypeId]: true }));
      await action();
    } finally {
      setLoadingStates(prev => ({ ...prev, [seatTypeId]: false }));
    }
  };

  return (
    <div className="rounded-xl border bg-white shadow-lg w-full">
      <Table className="w-full text-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-3 text-center">Nombre</TableHead>
            <TableHead className="px-4 py-3 text-center">Descripción</TableHead>
            <TableHead className="px-4 py-3 text-center">Factor Precio</TableHead>
            <TableHead className="px-4 py-3 text-center">Color</TableHead>
            <TableHead className="px-4 py-3 text-center">Icono</TableHead>
            <TableHead className="px-4 py-3 text-center">Estado</TableHead>
            <TableHead className="px-4 py-3 text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {seatTypes.map((seatType) => (
            <TableRow key={seatType.id} className="hover:bg-accent/30 transition-colors align-middle">
              <TableCell className="px-4 py-3 text-center max-w-[120px] truncate" title={seatType.nombre}>
                {seatType.nombre}
              </TableCell>
              <TableCell className="px-4 py-3 text-center max-w-[180px] truncate" title={seatType.descripcion}>
                {seatType.descripcion}
              </TableCell>
              <TableCell className="px-4 py-3 text-center">
                ${seatType.factorPrecio}
              </TableCell>
              <TableCell className="px-4 py-3 text-center">
                <span
                  className="inline-block w-6 h-6 rounded-full border mx-auto"
                  style={{ backgroundColor: seatType.color }}
                  title={seatType.color}
                />
              </TableCell>
              <TableCell className="px-4 py-3 text-center">
                <span className="inline-flex items-center justify-center w-6 h-6 mx-auto">
                  {seatType.icono}
                </span>
              </TableCell>
              <TableCell className="px-4 py-3 text-center">
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
              <TableCell className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleAction(async () => onEdit(seatType), seatType.id)}
                    disabled={loadingStates[seatType.id]}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {loadingStates[seatType.id] ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Pencil className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleAction(async () => onDelete(seatType.id), seatType.id)}
                    disabled={loadingStates[seatType.id]}
                  >
                    {loadingStates[seatType.id] ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}; 