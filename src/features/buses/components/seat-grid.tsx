import React from "react";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { Armchair, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AVAILABLE_ICONS } from "@/features/seating/constants/available-icons";
import { SeatCellProps, SeatGridProps } from "../interfaces/bus-auxiliar.interface";

const SeatCell = React.memo(({ row, col, floorConfig, seatTypes, disabled }: SeatCellProps) => {
  const droppableId = `${floorConfig.numeroPiso}-${row}-${col}`;
  const currentSeat = floorConfig.asientos.find(
    (seat) => seat.fila === row && seat.columna === col
  );
  const seatType = currentSeat
    ? seatTypes.find((type) => type.id === currentSeat.tipoId)
    : undefined;

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: droppableId,
    disabled
  });

  const { attributes, listeners, setNodeRef: setDraggableRef, transform, isDragging } = useDraggable({
    id: `seat-${droppableId}`,
    data: currentSeat,
    disabled: !currentSeat || disabled
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setDroppableRef}
      className={cn(
        "h-16 w-16 rounded-lg border flex flex-col items-center justify-center transition-all",
        "bg-white",
        isOver ? "bg-primary/20 border-primary shadow-lg" : "",
        !currentSeat && "border-dashed"
      )}
      style={currentSeat ? { borderColor: seatType?.color || 'gray' } : undefined}
    >
      {currentSeat ? (
        <div
          ref={setDraggableRef}
          {...listeners}
          {...attributes}
          className={cn(
            "flex flex-col items-center w-full h-full justify-center transition-transform cursor-move",
            isDragging && "shadow-lg transform-gpu"
          )}
          style={style}
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
});

SeatCell.displayName = 'SeatCell';

export const SeatGrid = ({ floorConfig, seatTypes, disabled = false, templateApplied = false }: SeatGridProps) => {
  // MODO PLANTILLA: cuadrícula simple sin pasillo
  if (templateApplied) {
    const maxRow = floorConfig.rows;
    const maxCol = (floorConfig.leftColumns || 2) + (floorConfig.rightColumns || 2);
    return (
      <div className="space-y-4">
        {Array.from({ length: maxRow }, (_, i) => (
          <div key={i} className="flex gap-2 justify-center items-center">
            {Array.from({ length: maxCol }, (_, j) => (
              <div key={j} className="w-16">
                <SeatCell
                  row={i + 1}
                  col={j + 1}
                  floorConfig={floorConfig}
                  seatTypes={seatTypes}
                  disabled={disabled}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // MODO TRADICIONAL: layout clásico con pasillo SIEMPRE
  const renderBasicRow = (rowIndex: number) => {
    const isLastRow = rowIndex === floorConfig.rows;
    const leftSeats = Array.from({ length: floorConfig.leftColumns }, (_, i) => (
      <div key={`left-${i}`} className="w-16">
        <SeatCell
          row={rowIndex}
          col={i + 1}
          floorConfig={floorConfig}
          seatTypes={seatTypes}
          disabled={disabled}
        />
      </div>
    ));

    const rightSeats = Array.from({ length: floorConfig.rightColumns }, (_, i) => (
      <div key={`right-${i}`} className="w-16">
        <SeatCell
          row={rowIndex}
          col={i + floorConfig.leftColumns + 2}
          floorConfig={floorConfig}
          seatTypes={seatTypes}
          disabled={disabled}
        />
      </div>
    ));

    return (
      <div key={rowIndex} className="flex gap-4 justify-center">
        <div className="flex gap-2">{leftSeats}</div>
        {isLastRow ? (
          <div className="w-16">
            <SeatCell
              row={rowIndex}
              col={floorConfig.leftColumns + 1}
              floorConfig={floorConfig}
              seatTypes={seatTypes}
              disabled={disabled}
            />
          </div>
        ) : (
          <div className="w-8 bg-gray-100 rounded-md flex items-center justify-center">
            <span className="text-xs text-gray-500 rotate-90">Pasillo</span>
          </div>
        )}
        <div className="flex gap-2">{rightSeats}</div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {Array.from({ length: floorConfig.rows }, (_, i) => renderBasicRow(i + 1))}
    </div>
  );
};
