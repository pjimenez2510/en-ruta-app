import React from "react";
// TODO: Migrar a @dnd-kit cuando sea necesario
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from '@dnd-kit/core';
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import {
//   useSortable,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
import { Armchair, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { BusSeat } from "../interfaces/seat-config";
import { SeatType } from "@/features/seating/interfaces/seat-type.interface";
import { AVAILABLE_ICONS } from "@/features/seating/constants/available-icons";

interface FloorConfig {
  pisoBusId: number;
  numeroPiso: number;
  leftColumns: number;
  rightColumns: number;
  rows: number;
  asientos: BusSeat[];
  posicionPasillo?: number;
}

interface SeatGridProps {
  floor: FloorConfig;
  floorDimensions: {[key: number]: FloorConfig};
  availableSeatTypes: SeatType[];
}

export const SeatGrid = ({ floor, floorDimensions, availableSeatTypes }: SeatGridProps) => {
  const dimensions = floorDimensions[floor.numeroPiso];
  if (!dimensions) return null;

  const { rows, leftColumns, rightColumns } = dimensions;
  const grid = [];

  // Calcular la posición del pasillo
  const posicionPasillo = leftColumns + 1;

  const renderSeatCell = (currentSeat: BusSeat | undefined, droppableId: string, isPasillo: boolean = false) => {
    if (isPasillo) {
      return (
        <div
          key={`pasillo-${droppableId}`}
          className="h-16 w-16 rounded-lg border border-dashed bg-gray-100 flex items-center justify-center"
        >
          <span className="text-xs text-gray-500">Pasillo</span>
        </div>
      );
    }

    const seatType = availableSeatTypes.find(type => type.id === currentSeat?.tipoId);
      return (
      <div
        key={droppableId}
        className={cn(
          "h-16 w-16 rounded-lg border flex flex-col items-center justify-center transition-all",
          "bg-white",
          !currentSeat && "border-dashed"
        )}
        style={currentSeat ? { borderColor: seatType?.color || 'gray' } : undefined}
      >
        {currentSeat ? (
          <div
            className={cn(
              "flex flex-col items-center w-full h-full justify-center transition-transform cursor-pointer",
            )}
          >
            {seatType?.icono && AVAILABLE_ICONS[seatType.icono as keyof typeof AVAILABLE_ICONS] ? (
              <div className="h-6 w-6">
                {React.createElement(AVAILABLE_ICONS[seatType.icono as keyof typeof AVAILABLE_ICONS], {
                  className: "h-6 w-6",
                  style: { color: seatType?.color || 'gray' }
                })}
              </div>
            ) : (
              <Armchair className="h-6 w-6" style={{ color: seatType?.color || 'gray' }} />
            )}
            <span className="text-xs font-medium mt-1">{currentSeat.numero}</span>
          </div>
        ) : (
          <Plus className="h-4 w-4 text-gray-400" />
        )}
      </div>
    );
  };

  for (let row = 1; row <= rows; row++) {
    const rowCells = [];
    const isLastRow = row === rows;

    // Lado izquierdo
    for (let col = 1; col <= leftColumns; col++) {
      const currentSeat = floor.asientos.find(s => s.fila === row && s.columna === col);
      rowCells.push(
        renderSeatCell(
          currentSeat,
          `${floor.numeroPiso}-${row}-${col}`
        )
      );
    }

    // Pasillo o asiento central en la última fila
    if (isLastRow) {
      // En la última fila, verificar si hay un asiento en la posición del pasillo
      const asientoPasillo = floor.asientos.find(s => s.fila === row && s.columna === posicionPasillo);
      if (asientoPasillo) {
        // Si hay asiento en la posición del pasillo en la última fila
        rowCells.push(
          renderSeatCell(
            asientoPasillo,
            `${floor.numeroPiso}-${row}-${posicionPasillo}`
          )
        );
      } else {
        // Si no hay asiento, mostrar espacio droppable
        rowCells.push(
          renderSeatCell(
            undefined,
            `${floor.numeroPiso}-${row}-${posicionPasillo}`
          )
        );
      }
    } else {
      // Pasillo para las filas que no son la última
      rowCells.push(
        renderSeatCell(undefined, `${floor.numeroPiso}-${row}-${posicionPasillo}`, true)
      );
    }

    // Lado derecho
    for (let col = 1; col <= rightColumns; col++) {
      const actualCol = posicionPasillo + col;
      const currentSeat = floor.asientos.find(s => s.fila === row && s.columna === actualCol);
      rowCells.push(
        renderSeatCell(
          currentSeat,
          `${floor.numeroPiso}-${row}-${actualCol}`
        )
      );
    }

    grid.push(
      <div key={`row-${row}`} className="flex gap-2">
        {rowCells}
      </div>
    );
  }

  return <>{grid}</>;
};