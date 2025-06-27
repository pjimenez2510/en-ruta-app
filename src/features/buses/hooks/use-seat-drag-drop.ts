import { DragEndEvent } from "@dnd-kit/core";
import { BusSeat } from "../interfaces/seat-config";

interface FloorConfig {
  pisoBusId: number;
  numeroPiso: number;
  leftColumns: number;
  rightColumns: number;
  rows: number;
  asientos: BusSeat[];
  posicionPasillo?: number;
}

interface UseSeatDragDropProps {
  floorConfigs: FloorConfig[];
  setFloorConfigs: React.Dispatch<React.SetStateAction<FloorConfig[]>>;
  reorderSeatNumbers: (seats: BusSeat[]) => BusSeat[];
}

interface SourceInfo {
  typeId?: number;
  floor?: number;
  row?: number;
  col?: number;
}

export const useSeatDragDrop = ({ setFloorConfigs, reorderSeatNumbers }: UseSeatDragDropProps) => {
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Extraer información del origen
    const isFromTemplate = active.id.toString().startsWith('template-');
    const sourceInfo: SourceInfo = isFromTemplate
      ? { typeId: parseInt(active.id.toString().replace('template-', '')) }
      : parseDroppableId(active.id.toString().replace('seat-', ''));

    // Extraer información del destino
    const destInfo = parseDroppableId(over.id.toString());

    // Validar que el destino no sea el pasillo
    const isPasilloDestination = (config: FloorConfig, col: number, row: number) => {
      return col === config.leftColumns && row !== config.rows;
    };

    setFloorConfigs(prev => {
      const newConfigs = [...prev];
      const destFloorIndex = newConfigs.findIndex(f => f.numeroPiso === destInfo.floor);

      if (destFloorIndex === -1) return prev;

      // Verificar si el destino es el pasillo
      if (isPasilloDestination(newConfigs[destFloorIndex], destInfo.col, destInfo.row)) {
        return prev;
      }

      if (isFromTemplate && sourceInfo.typeId) {
        // Manejar arrastre desde la plantilla
        const newSeat: BusSeat = {
          numero: `${destInfo.row}-${destInfo.col}`,
          fila: destInfo.row,
          columna: destInfo.col,
          tipoId: sourceInfo.typeId,
          estado: 'DISPONIBLE',
        };

        // Eliminar asiento existente si lo hay
        newConfigs[destFloorIndex].asientos = newConfigs[destFloorIndex].asientos.filter(
          seat => !(seat.fila === destInfo.row && seat.columna === destInfo.col)
        );

        // Agregar nuevo asiento
        newConfigs[destFloorIndex].asientos.push(newSeat);

        // Renumerar todos los asientos
        newConfigs[destFloorIndex].asientos = reorderSeatNumbers(newConfigs[destFloorIndex].asientos);

        return newConfigs;
      }

      // Manejar arrastre entre posiciones
      if (!sourceInfo.floor) return prev;

      const sourceFloorIndex = newConfigs.findIndex(f => f.numeroPiso === sourceInfo.floor);

      if (sourceFloorIndex === -1) return prev;

      // Encontrar el asiento que se está moviendo
      const sourceIndex = newConfigs[sourceFloorIndex].asientos.findIndex(
        seat => seat.fila === sourceInfo.row && seat.columna === sourceInfo.col
      );

      if (sourceIndex === -1) return prev;

      // Obtener el asiento y sus propiedades originales
      const movedSeat = newConfigs[sourceFloorIndex].asientos[sourceIndex];
      const originalSeatType = movedSeat.tipoId;
      const originalSeatState = movedSeat.estado;

      // Eliminar el asiento de la posición original
      newConfigs[sourceFloorIndex].asientos.splice(sourceIndex, 1);

      // Eliminar asiento existente en el destino si lo hay
      const existingSeatIndex = newConfigs[destFloorIndex].asientos.findIndex(
        seat => seat.fila === destInfo.row && seat.columna === destInfo.col
      );

      if (existingSeatIndex !== -1) {
        newConfigs[destFloorIndex].asientos.splice(existingSeatIndex, 1);
      }

      // Agregar el asiento en la nueva posición
      newConfigs[destFloorIndex].asientos.push({
        ...movedSeat,
        fila: destInfo.row,
        columna: destInfo.col,
        tipoId: originalSeatType,
        estado: originalSeatState
      });

      // Renumerar asientos si es necesario
      if (sourceFloorIndex === destFloorIndex) {
        newConfigs[sourceFloorIndex].asientos = reorderSeatNumbers(newConfigs[sourceFloorIndex].asientos);
      } else {
        newConfigs[sourceFloorIndex].asientos = reorderSeatNumbers(newConfigs[sourceFloorIndex].asientos);
        newConfigs[destFloorIndex].asientos = reorderSeatNumbers(newConfigs[destFloorIndex].asientos);
      }

      return newConfigs;
    });
  };

  return { onDragEnd };
};

// Función auxiliar para parsear los IDs de los droppables
function parseDroppableId(id: string) {
  const [floor, row, col] = id.split('-').map(Number);
  return { floor, row, col };
}