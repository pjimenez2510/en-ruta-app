import React from "react";
import { Armchair } from "lucide-react";
import { cn } from "@/lib/utils";
import { BusSeat } from "../interfaces/seat-config";
import { SeatType } from "@/features/seating/interfaces/seat-type.interface";
import { AVAILABLE_ICONS } from "@/features/seating/constants/available-icons";

interface FloorData {
  numeroPiso: number;
  asientos: BusSeat[];
}

interface SeatGridConfig {
  maxFila: number;
  posicionPasillo: number;
  leftColumns: number;
  rightColumns: number;
}

export const useSeatGridRenderer = () => {
  const calculateGridConfig = (asientos: BusSeat[]): SeatGridConfig => {
    if (!asientos || asientos.length === 0) {
      return {
        maxFila: 0,
        posicionPasillo: 3,
        leftColumns: 2,
        rightColumns: 2
      };
    }

    const maxFila = Math.max(...asientos.map(a => a.fila));
    
    // Buscar el gap más grande entre columnas consecutivas (excluyendo la última fila)
    const columnasExcluyendoUltimaFila = [...new Set(
      asientos
        .filter(a => a.fila !== maxFila)
        .map(a => a.columna)
    )].sort((a, b) => a - b);

    let posicionPasillo = -1;
    let maxGap = 0;

    for (let i = 0; i < columnasExcluyendoUltimaFila.length - 1; i++) {
      const gap = columnasExcluyendoUltimaFila[i + 1] - columnasExcluyendoUltimaFila[i];
      if (gap > maxGap) {
        maxGap = gap;
        posicionPasillo = columnasExcluyendoUltimaFila[i] + Math.floor(gap / 2);
      }
    }

    // Si no se encuentra un gap claro, usar la distribución por defecto
    if (posicionPasillo === -1) {
      const totalColumnas = Math.max(...columnasExcluyendoUltimaFila);
      posicionPasillo = Math.ceil(totalColumnas / 2) + 1;
    }

    // Contar columnas a cada lado del pasillo
    const leftColumns = columnasExcluyendoUltimaFila.filter(c => c < posicionPasillo).length || 1;
    const rightColumns = columnasExcluyendoUltimaFila.filter(c => c > posicionPasillo).length || 1;

    return {
      maxFila,
      posicionPasillo,
      leftColumns,
      rightColumns
    };
  };

  const renderSeatIcon = (seatType: SeatType | undefined, className: string = "h-4 w-4") => {
    if (seatType?.icono) {
      return (
        <div className={className}>
          {React.createElement(AVAILABLE_ICONS[seatType.icono as keyof typeof AVAILABLE_ICONS], {
            className,
            style: { color: seatType?.color }
          })}
        </div>
      );
    }
    
    return (
      <Armchair 
        className={className} 
        style={{ color: seatType?.color || 'gray' }} 
      />
    );
  };

  const renderSeatGrid = (
    floor: FloorData,
    seatTypes: SeatType[],
    options: {
      seatSize?: string;
      interactive?: boolean;
      onSeatClick?: (fila: number, columna: number) => void;
      selectedSeatType?: number;
      showSeatNumbers?: boolean;
    } = {}
  ) => {
    const {
      seatSize = "h-12 w-12",
      interactive = false,
      onSeatClick,
      selectedSeatType,
      showSeatNumbers = true
    } = options;

    const config = calculateGridConfig(floor.asientos);
    
    if (config.maxFila === 0) {
      return (
        <div className="flex items-center justify-center h-48">
          <p className="text-gray-500">No hay asientos configurados para este piso</p>
        </div>
      );
    }

    const grid = [];

    for (let fila = 1; fila <= config.maxFila; fila++) {
      const rowCells = [];
      const isLastRow = fila === config.maxFila;

      // Lado izquierdo
      for (let col = 1; col <= config.leftColumns; col++) {
        const asiento = floor.asientos.find(a => a.fila === fila && a.columna === col);
        rowCells.push(
          renderSeatCell(
            asiento,
            seatTypes,
            `${fila}-${col}`,
            seatSize,
            interactive,
            onSeatClick,
            selectedSeatType,
            showSeatNumbers
          )
        );
      }

      // Pasillo o asiento central en la última fila
      const asientoPasillo = floor.asientos.find(a => a.fila === fila && a.columna === config.posicionPasillo);
      
      if (isLastRow && asientoPasillo) {
        // Asiento en la última fila
        rowCells.push(
          renderSeatCell(
            asientoPasillo,
            seatTypes,
            `${fila}-${config.posicionPasillo}`,
            seatSize,
            interactive,
            onSeatClick,
            selectedSeatType,
            showSeatNumbers
          )
        );
      } else {
        // Pasillo
        rowCells.push(
          <div
            key={`pasillo-${fila}-${config.posicionPasillo}`}
            className={cn(
              seatSize,
              "rounded-lg border border-dashed bg-gray-100 flex items-center justify-center"
            )}
          >
            <span className="text-xs text-gray-500">Pasillo</span>
          </div>
        );
      }

      // Lado derecho
      for (let col = 1; col <= config.rightColumns; col++) {
        const actualCol = config.posicionPasillo + col;
        const asiento = floor.asientos.find(a => a.fila === fila && a.columna === actualCol);
        rowCells.push(
          renderSeatCell(
            asiento,
            seatTypes,
            `${fila}-${actualCol}`,
            seatSize,
            interactive,
            onSeatClick,
            selectedSeatType,
            showSeatNumbers
          )
        );
      }

      grid.push(
        <div key={`row-${fila}`} className="flex gap-2">
          {rowCells}
        </div>
      );
    }

    return grid;
  };

  const renderSeatCell = (
    asiento: BusSeat | undefined,
    seatTypes: SeatType[],
    key: string,
    seatSize: string,
    interactive: boolean,
    onSeatClick?: (fila: number, columna: number) => void,
    selectedSeatType?: number,
    showSeatNumbers: boolean = true
  ) => {
    if (!asiento) {
      return (
        <div
          key={`empty-${key}`}
          className={seatSize}
        />
      );
    }

    const seatType = seatTypes.find(type => type.id === asiento.tipoId);
    const isSelected = selectedSeatType === asiento.tipoId;

    const Component = interactive ? 'button' : 'div';
    const props = interactive && onSeatClick ? {
      onClick: () => onSeatClick(asiento.fila, asiento.columna)
    } : {};

    return (
      <Component
        key={`asiento-${key}`}
        className={cn(
          seatSize,
          "rounded-lg border flex flex-col items-center justify-center",
          interactive && "transition-all hover:shadow-md",
          isSelected && "ring-2 ring-primary"
        )}
        style={{ borderColor: seatType?.color || 'gray' }}
        {...props}
      >
        {renderSeatIcon(seatType, seatSize.includes('h-16') ? "h-6 w-6" : "h-4 w-4")}
        {showSeatNumbers && (
          <span className="text-xs mt-1">{asiento.numero}</span>
        )}
      </Component>
    );
  };

  return {
    renderSeatGrid,
    renderSeatIcon,
    calculateGridConfig
  };
};