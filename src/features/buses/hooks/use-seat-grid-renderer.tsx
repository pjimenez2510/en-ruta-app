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
    const maxColumna = Math.max(...asientos.map(a => a.columna));
    const minColumna = Math.min(...asientos.map(a => a.columna));

    // Crear un mapa de posiciones ocupadas
    const posicionesOcupadas = new Set(
      asientos.map(a => `${a.fila}-${a.columna}`)
    );

    // Encontrar los espacios vacíos más comunes por fila
    const espaciosVacios = new Map<number, number>(); // columna -> frecuencia
    
    for (let fila = 1; fila <= maxFila; fila++) {
      for (let col = minColumna; col <= maxColumna; col++) {
        if (!posicionesOcupadas.has(`${fila}-${col}`)) {
          espaciosVacios.set(col, (espaciosVacios.get(col) || 0) + 1);
        }
      }
    }

    // Encontrar la columna que más frecuentemente está vacía
    let posicionPasillo = minColumna;
    let maxFrecuencia = 0;
    
    espaciosVacios.forEach((frecuencia, columna) => {
      if (frecuencia > maxFrecuencia) {
        maxFrecuencia = frecuencia;
        posicionPasillo = columna;
      }
    });

    // Contar columnas a cada lado del pasillo
    const leftColumns = posicionPasillo - minColumna;
    const rightColumns = maxColumna - posicionPasillo;

    return {
      maxFila,
      posicionPasillo,
      leftColumns,
      rightColumns
    };
  };

  const renderSeatIcon = (seatType: SeatType | undefined, className: string = "h-4 w-4") => {
    if (seatType?.icono && AVAILABLE_ICONS[seatType.icono as keyof typeof AVAILABLE_ICONS]) {
      const IconComponent = AVAILABLE_ICONS[seatType.icono as keyof typeof AVAILABLE_ICONS];
      return (
        <div className={className}>
          <IconComponent className={className} style={{ color: seatType?.color || 'gray' }} />
        </div>
      );
    }
    
    // Si no hay tipo de asiento o el icono no es válido, mostrar Armchair por defecto
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
    const minColumna = Math.min(...floor.asientos.map(a => a.columna));
    const maxColumna = Math.max(...floor.asientos.map(a => a.columna));

    for (let fila = 1; fila <= config.maxFila; fila++) {
      const rowCells = [];

      for (let col = minColumna; col <= maxColumna; col++) {
        const asiento = floor.asientos.find(a => a.fila === fila && a.columna === col);
        
        if (asiento) {
          // Renderizar asiento
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
        } else {
          // Verificar si esta posición debería ser un pasillo
          const esColumnaVacia = !floor.asientos.some(a => a.columna === col);
          const hayAsientosAntes = floor.asientos.some(a => a.columna < col);
          const hayAsientosDespues = floor.asientos.some(a => a.columna > col);
          
          if (esColumnaVacia && hayAsientosAntes && hayAsientosDespues) {
            // Renderizar pasillo
            rowCells.push(
              <div
                key={`pasillo-${fila}-${col}`}
                className={cn(
                  seatSize,
                  "rounded-lg border border-dashed bg-gray-100 flex items-center justify-center"
                )}
              >
                <span className="text-xs text-gray-500">Pasillo</span>
              </div>
            );
          } else {
            // Renderizar espacio vacío
            rowCells.push(
              <div
                key={`empty-${fila}-${col}`}
                className={cn(
                  seatSize,
                  "rounded-lg border border-dashed border-gray-200 flex items-center justify-center"
                )}
              />
            );
          }
        }
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
          className={cn(
            seatSize,
            "rounded-lg border border-dashed border-gray-200 flex items-center justify-center"
          )}
        />
      );
    }

    const seatType = seatTypes.find(t => t.id === asiento.tipoId);
    const isSelected = selectedSeatType === asiento.tipoId;

    return (
      <div
        key={`seat-${key}`}
        className={cn(
          seatSize,
          "rounded-lg border",
          interactive ? "cursor-pointer hover:bg-gray-50" : "",
          isSelected ? "border-blue-500" : "border-gray-200"
        )}
        onClick={() => {
          if (interactive && onSeatClick) {
            onSeatClick(asiento.fila, asiento.columna);
          }
        }}
      >
        <div className="h-full w-full flex flex-col items-center justify-center gap-1">
          {renderSeatIcon(seatType)}
          {showSeatNumbers && (
            <span className="text-xs font-medium">{asiento.numero}</span>
          )}
        </div>
      </div>
    );
  };

  return {
    renderSeatGrid,
    renderSeatIcon,
    calculateGridConfig
  };
};