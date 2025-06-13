import { useState, useEffect } from "react";
import { BusSeat, BusCreationData } from "../interfaces/seat-config";
import { BusFormValues } from "../interfaces/form-schema";

interface FloorConfig {
  pisoBusId: number;
  numeroPiso: number;
  leftColumns: number;
  rightColumns: number;
  rows: number;
  asientos: BusSeat[];
  posicionPasillo?: number;
}

interface UseFloorConfigurationProps {
  busInfo: BusFormValues & { totalAsientos: number };
  busModels: any[];
  initialData?: BusFormValues & { 
    totalAsientos?: number;
    pisos?: Array<{
      id: number;
      busId: number;
      numeroPiso: number;
      asientos: BusSeat[];
    }>;
  };
}

export const useFloorConfiguration = ({ busInfo, busModels, initialData }: UseFloorConfigurationProps) => {
  const [floorConfigs, setFloorConfigs] = useState<FloorConfig[]>([]);
  const [floorDimensions, setFloorDimensions] = useState<{[key: number]: FloorConfig}>({});

  useEffect(() => {
    if (busInfo.modeloBusId && busModels.length > 0) {
      const selectedModel = busModels.find(model => model.id === busInfo.modeloBusId);
      if (!selectedModel) return;

      if (initialData?.pisos) {
        // Si hay datos iniciales, configurar los pisos con esos datos
        const asientos = initialData.pisos;

        // Encontrar dimensiones del grid para cada piso
        const configs = asientos.map(piso => {
          const maxFila = Math.max(...piso.asientos.map(a => a.fila));
          const todasLasColumnas = [...new Set(piso.asientos.map(a => a.columna))].sort((a, b) => a - b);

          // Encontrar posición del pasillo y columnas a cada lado
          let posicionPasillo = -1;
          let leftColumns = 0;
          let rightColumns = 0;

          // Buscar el gap más grande entre columnas consecutivas (excluyendo la última fila)
          const columnasExcluyendoUltimaFila = [...new Set(
            piso.asientos
              .filter(a => a.fila !== maxFila)
              .map(a => a.columna)
          )].sort((a, b) => a - b);

          // Encontrar el gap más grande (que será el pasillo)
          let maxGap = 0;
          for (let i = 0; i < columnasExcluyendoUltimaFila.length - 1; i++) {
            const gap = columnasExcluyendoUltimaFila[i + 1] - columnasExcluyendoUltimaFila[i];
            if (gap > maxGap) {
              maxGap = gap;
              posicionPasillo = columnasExcluyendoUltimaFila[i] + Math.floor(gap / 2);
            }
          }

          // Si no se encontró un gap claro, asumir que el pasillo está en el medio
          if (posicionPasillo === -1) {
            posicionPasillo = Math.floor(todasLasColumnas.length / 2);
          }

          // Contar columnas a cada lado del pasillo
          leftColumns = todasLasColumnas.filter(c => c < posicionPasillo).length;
          rightColumns = todasLasColumnas.filter(c => c > posicionPasillo).length;

          // Validar que tengamos al menos 1 columna por lado
          if (leftColumns === 0) leftColumns = 1;
          if (rightColumns === 0) rightColumns = 1;

          return {
            pisoBusId: piso.id,
            numeroPiso: piso.numeroPiso,
            leftColumns,
            rightColumns,
            rows: maxFila,
            asientos: piso.asientos,
            posicionPasillo
          };
        });

        setFloorConfigs(configs);

        // Actualizar las dimensiones de los pisos
        const dimensions: {[key: number]: FloorConfig} = {};
        configs.forEach(config => {
          dimensions[config.numeroPiso] = config;
        });
        setFloorDimensions(dimensions);
      } else {
        initializeFloorConfigs(selectedModel.numeroPisos);
      }
    }
  }, [busInfo.modeloBusId, busModels, initialData?.pisos]);

  const initializeFloorConfigs = (numPisos: number) => {
    const configs: FloorConfig[] = Array.from(
      { length: numPisos }, 
      (_, i) => ({
        pisoBusId: 0,
        numeroPiso: i + 1,
        leftColumns: 2,
        rightColumns: 2,
        rows: 3,
        asientos: []
      })
    );
    setFloorConfigs(configs);
    
    const initialDimensions: {[key: number]: FloorConfig} = {};
    for (let i = 1; i <= numPisos; i++) {
      initialDimensions[i] = {
        pisoBusId: 0,
        numeroPiso: i,
        leftColumns: 2,
        rightColumns: 2,
        rows: 3,
        asientos: []
      };
    }
    setFloorDimensions(initialDimensions);
  };

  const updateFloorDimensions = (
    floorNumber: number, 
    dimension: 'rows' | 'leftColumns' | 'rightColumns', 
    value: number
  ) => {
    // Validar y ajustar el valor
    let adjustedValue = value;
    if (dimension === 'leftColumns' || dimension === 'rightColumns') {
      adjustedValue = Math.min(Math.max(1, value), 3); // 1-3 columnas por lado
    } else {
      adjustedValue = Math.min(Math.max(3, value), 12); // 3-12 filas
    }

    // Actualizar floorDimensions
    setFloorDimensions(prev => {
      const newDimensions = { ...prev };
      if (!newDimensions[floorNumber]) {
        newDimensions[floorNumber] = {
          pisoBusId: 0,
          numeroPiso: floorNumber,
          leftColumns: 2,
          rightColumns: 2,
          rows: 3,
          asientos: []
        };
      }
      newDimensions[floorNumber] = {
        ...newDimensions[floorNumber],
        [dimension]: adjustedValue
      };
      return newDimensions;
    });

    // Actualizar floorConfigs
    setFloorConfigs(prev => 
      prev.map(config => {
        if (config.numeroPiso === floorNumber) {
          return {
            ...config,
            [dimension]: adjustedValue
          };
        }
        return config;
      })
    );
  };

  const reorderSeatNumbers = (seats: BusSeat[]): BusSeat[] => {
    // Ordenar asientos por fila y columna
    const sortedSeats = [...seats].sort((a, b) => {
      if (a.fila === b.fila) {
        return a.columna - b.columna;
      }
      return a.fila - b.fila;
    });

    // Reasignar números
    return sortedSeats.map((seat, index) => ({
      ...seat,
      numero: `${index + 1}`
    }));
  };

  return {
    floorConfigs,
    setFloorConfigs,
    floorDimensions,
    updateFloorDimensions,
    reorderSeatNumbers
  };
};