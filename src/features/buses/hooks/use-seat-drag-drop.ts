import { DropResult } from "react-beautiful-dnd";
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

export const useSeatDragDrop = ({ setFloorConfigs, reorderSeatNumbers }: UseSeatDragDropProps) => {
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // Si no hay destino, el usuario soltó fuera de un área válida
    if (!destination) return;

    // Extraer información del origen y destino
    const [sourceFloor, sourceRow, sourceCol] = source.droppableId.split('-').map(Number);
    const [destFloor, destRow, destCol] = destination.droppableId.split('-').map(Number);

    // Si es un arrastre desde la plantilla
    if (source.droppableId.startsWith('template-')) {
      const typeId = parseInt(source.droppableId.replace('template-', ''));
      const newSeat: BusSeat = {
        numero: `${destRow}-${destCol}`, // Número temporal que será reordenado
        fila: destRow,
        columna: destCol,
        tipoId: typeId,
        estado: 'DISPONIBLE',
      };

      setFloorConfigs(prev => {
        const newConfigs = [...prev];
        const floorIndex = newConfigs.findIndex(f => f.numeroPiso === destFloor);
        if (floorIndex === -1) return prev;

        // Eliminar asiento existente si lo hay
        newConfigs[floorIndex].asientos = newConfigs[floorIndex].asientos.filter(
          seat => !(seat.fila === destRow && seat.columna === destCol)
        );

        // Agregar nuevo asiento
        newConfigs[floorIndex].asientos.push(newSeat);

        // Renumerar todos los asientos
        newConfigs[floorIndex].asientos = reorderSeatNumbers(newConfigs[floorIndex].asientos);

        return newConfigs;
      });
      return;
    }

    setFloorConfigs(prev => {
      const newConfigs = [...prev];
      const sourceFloorIndex = newConfigs.findIndex(f => f.numeroPiso === sourceFloor);
      const destFloorIndex = newConfigs.findIndex(f => f.numeroPiso === destFloor);

      if (sourceFloorIndex === -1 || destFloorIndex === -1) return prev;

      // Encontrar el asiento que se está moviendo
      const sourceIndex = newConfigs[sourceFloorIndex].asientos.findIndex(
        seat => seat.fila === sourceRow && seat.columna === sourceCol
      );

      if (sourceIndex === -1) return prev;

      // Obtener el asiento
      const [movedSeat] = newConfigs[sourceFloorIndex].asientos.splice(sourceIndex, 1);

      // Eliminar asiento existente en el destino si lo hay
      newConfigs[destFloorIndex].asientos = newConfigs[destFloorIndex].asientos.filter(
        seat => !(seat.fila === destRow && seat.columna === destCol)
      );

      // Agregar el asiento en la nueva posición
      newConfigs[destFloorIndex].asientos.push({
        ...movedSeat,
        fila: destRow,
        columna: destCol
      });

      // Renumerar asientos si es necesario
      if (sourceFloor === destFloor) {
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