import React from "react";
import { Armchair, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { SeatType } from "@/features/seating/interfaces/seat-type.interface";
import { AVAILABLE_ICONS } from "@/features/seating/constants/available-icons";
import { FloorConfig, SeatGridSimpleProps } from "../interfaces/bus-auxiliar.interface";

export const SeatGrid = ({ floor, floorDimensions, availableSeatTypes }: SeatGridSimpleProps) => {
  const dimensions = floorDimensions[floor.numeroPiso];
  if (!dimensions) return null;

  const { rows, leftColumns, rightColumns } = dimensions;
  const grid = [];

  // Construir la grilla
  for (let row = 0; row < rows; row++) {
    const rowElements = [];
    
    // Columnas izquierdas
    for (let leftCol = 0; leftCol < leftColumns; leftCol++) {
      const position = `${row}-${leftCol}-left`;
      rowElements.push(renderSeat(position, floor, availableSeatTypes));
    }
    
    // Pasillo
    if (leftColumns > 0 && rightColumns > 0) {
      rowElements.push(
        <div key={`aisle-${row}`} className="w-8 flex items-center justify-center">
          <span className="text-xs text-gray-500">Pasillo</span>
        </div>
      );
    }
    
    // Columnas derechas
    for (let rightCol = 0; rightCol < rightColumns; rightCol++) {
      const position = `${row}-${rightCol}-right`;
      rowElements.push(renderSeat(position, floor, availableSeatTypes));
    }
    
    grid.push(
      <div key={`row-${row}`} className="flex gap-2 items-center justify-center">
        {rowElements}
      </div>
    );
  }

  return (
    <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
      <h4 className="text-sm font-medium text-center mb-4">
        Piso {floor.numeroPiso}
      </h4>
      {grid}
    </div>
  );
};

function renderSeat(position: string, floor: FloorConfig, availableSeatTypes: SeatType[]) {
  // Extraer fila y columna de la posición para encontrar el asiento
  const [row, col] = position.split('-');
  const currentSeat = floor.asientos.find(seat => 
    seat.fila === parseInt(row) && seat.columna === parseInt(col)
  );
  const seatType = availableSeatTypes.find(type => type.id === currentSeat?.tipoId);
  
  return (
    <div
      key={position}
      className={cn(
        "h-16 w-16 rounded-lg border flex flex-col items-center justify-center transition-all",
        "bg-white",
        !currentSeat && "border-dashed"
      )}
      style={currentSeat ? { borderColor: seatType?.color || 'gray' } : undefined}
    >
      {currentSeat ? (
        <div
          className="w-full h-full flex flex-col items-center justify-center rounded cursor-pointer hover:bg-gray-50"
          style={{
            backgroundColor: seatType?.color || 'gray',
            color: 'white'
          }}
        >
          {seatType && AVAILABLE_ICONS[seatType.icono] ? (
            React.createElement(AVAILABLE_ICONS[seatType.icono], {
              size: 20,
              className: "text-white"
            })
          ) : (
            <Armchair size={20} className="text-white" />
          )}
          <span className="text-xs font-semibold text-white">
            {currentSeat.numero}
          </span>
        </div>
      ) : (
        <div className="text-gray-400 text-xs text-center">
          <Plus size={16} />
          <span>Asiento</span>
        </div>
      )}
    </div>
  );
}
