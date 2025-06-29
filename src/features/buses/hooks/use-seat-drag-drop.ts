import { DragEndEvent } from "@dnd-kit/core";
import { BusSeat } from "../interfaces/seat-config";
import { FloorConfig, SourceInfo } from "../interfaces/bus-auxiliar.interface";

interface UseSeatDragDropProps {
  setFloorConfigs: React.Dispatch<React.SetStateAction<FloorConfig[]>>;
  reorderSeatNumbersGlobal: (floorConfigs: FloorConfig[]) => FloorConfig[];
}

export const useSeatDragDrop = ({ setFloorConfigs, reorderSeatNumbersGlobal }: UseSeatDragDropProps) => {
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const isFromTemplate = active.id.toString().startsWith('template-');
    const sourceInfo: SourceInfo = isFromTemplate
      ? { typeId: parseInt(active.id.toString().replace('template-', '')) }
      : parseDroppableId(active.id.toString().replace('seat-', ''));

    // Eliminar asiento si se suelta fuera de la matriz
    if (!over && !isFromTemplate && sourceInfo.floor && sourceInfo.row && sourceInfo.col) {
      setFloorConfigs(prev => {
        const newConfigs = [...prev];
        const floorIdx = newConfigs.findIndex(f => f.numeroPiso === sourceInfo.floor);
        if (floorIdx === -1) return prev;
        newConfigs[floorIdx].asientos = newConfigs[floorIdx].asientos.filter(
          seat => !(seat.fila === sourceInfo.row && seat.columna === sourceInfo.col)
        );
        // Renumerar globalmente después de eliminar
        return reorderSeatNumbersGlobal(newConfigs);
      });
      return;
    }

    if (!over) return;

    const destInfo = parseDroppableId(over.id.toString());

    setFloorConfigs(prev => {
      const newConfigs = [...prev];
      const destFloorIndex = newConfigs.findIndex(f => f.numeroPiso === destInfo.floor);
      if (destFloorIndex === -1) return prev;
      const destFloor = newConfigs[destFloorIndex];

      if (isFromTemplate && sourceInfo.typeId) {
        const existingSeatIndex = destFloor.asientos.findIndex(
          seat => seat.fila === destInfo.row && seat.columna === destInfo.col
        );
        if (existingSeatIndex !== -1) {
          newConfigs[destFloorIndex].asientos[existingSeatIndex] = {
            ...newConfigs[destFloorIndex].asientos[existingSeatIndex],
            tipoId: sourceInfo.typeId
          };
        } else {
          const newSeat: BusSeat = {
            numero: `${destInfo.row}-${destInfo.col}`,
            fila: destInfo.row,
            columna: destInfo.col,
            tipoId: sourceInfo.typeId,
            estado: 'DISPONIBLE',
          };
          newConfigs[destFloorIndex].asientos.push(newSeat);
        }
        // Renumerar globalmente después de agregar asiento
        return reorderSeatNumbersGlobal(newConfigs);
      }

      // Movimiento de asientos existentes
      if (!sourceInfo.floor) return prev;
      const sourceFloorIndex = newConfigs.findIndex(f => f.numeroPiso === sourceInfo.floor);
      if (sourceFloorIndex === -1) return prev;
      const sourceIndex = newConfigs[sourceFloorIndex].asientos.findIndex(
        seat => seat.fila === sourceInfo.row && seat.columna === sourceInfo.col
      );
      if (sourceIndex === -1) return prev;
      const movedSeat = newConfigs[sourceFloorIndex].asientos[sourceIndex];
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
      });
      // Renumerar globalmente después del movimiento
      return reorderSeatNumbersGlobal(newConfigs);
    });
  };

  return { onDragEnd };
};

function parseDroppableId(id: string) {
  const [floor, row, col] = id.split('-').map(Number);
  return { floor, row, col };
}