import React from 'react';
import { AVAILABLE_ICONS } from '@/features/seating/constants/available-icons';
import { Armchair } from 'lucide-react';
import { SeatTypeLegendProps } from '../interfaces/bus-auxiliar.interface';

export const SeatTypeLegend: React.FC<SeatTypeLegendProps> = ({ seatTypes }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <h3 className="text-sm font-medium mb-3">Tipos de Asiento</h3>
      <div className="grid grid-cols-2 gap-2">
        {seatTypes.map((type) => (
          <div key={type.id} className="flex items-center gap-2">
            {type.icono && AVAILABLE_ICONS[type.icono as keyof typeof AVAILABLE_ICONS] ? (
              <div className="h-5 w-5">
                {React.createElement(AVAILABLE_ICONS[type.icono as keyof typeof AVAILABLE_ICONS], {
                  className: "h-5 w-5",
                  style: { color: type.color }
                })}
              </div>
            ) : (
              <Armchair className="h-5 w-5" style={{ color: type.color }} />
            )}
            <span className="text-sm text-gray-700">{type.nombre}</span>
          </div>
        ))}
      </div>
    </div>
  );
}; 