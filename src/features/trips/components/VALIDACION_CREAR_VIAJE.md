// Archivo de validación del CreateViajeDto

/*
Según tu especificación del backend, el CreateViajeDto debe tener:

✅ CAMPOS REQUERIDOS:
- horarioRutaId*: number (ID del horario de ruta)
- busId*: number (ID del bus asignado al viaje)  
- fecha*: string($date-time) (Fecha del viaje)

✅ CAMPOS OPCIONALES:
- conductorId: number (ID del conductor asignado al viaje)
- ayudanteId: number (ID del ayudante asignado al viaje)
- estado: string (default: PROGRAMADO) - Enum: [PROGRAMADO, EN_RUTA, COMPLETADO, CANCELADO, RETRASADO]
- observaciones: string (Observaciones del viaje)
- generacion: string (default: MANUAL) - Enum: [MANUAL, AUTOMATICA]

VALIDACIONES IMPLEMENTADAS:

1. ✅ Formulario actualizado con los campos correctos del DTO
2. ✅ Estados actualizados: PROGRAMADO, EN_RUTA, COMPLETADO, CANCELADO, RETRASADO
3. ✅ Campos requeridos marcados con *
4. ✅ Campos opcionales permiten valores vacíos
5. ✅ Validación de tipos: horarioRutaId y busId se convierten a number
6. ✅ conductorId y ayudanteId son opcionales y se convierten a number solo si tienen valor
7. ✅ Fecha se convierte a ISO string
8. ✅ Removido campo horaSalidaReal que no está en el DTO del backend
9. ✅ Generación default "MANUAL" como especifica el backend
10. ✅ Estado default "PROGRAMADO" como especifica el backend

EJEMPLO DE DATOS QUE SE ENVÍAN AL BACKEND:
{
  "horarioRutaId": 1,
  "busId": 1,
  "fecha": "2025-06-16T12:03:29.132Z",
  "conductorId": 1, // opcional
  "ayudanteId": 1, // opcional  
  "estado": "PROGRAMADO", // opcional, default
  "observaciones": "Viaje regular matutino", // opcional
  "generacion": "MANUAL" // opcional, default
}

FUNCIONALIDADES:
- ✅ Carga de horarios desde useCrewData hook
- ✅ Carga de buses desde API externa
- ✅ Carga de conductores desde API externa (rol=CONDUCTOR)
- ✅ Carga de ayudantes desde API externa (rol=AYUDANTE) 
- ✅ Manejo de estados de carga y errores
- ✅ Validación con Zod
- ✅ Form validation con react-hook-form
- ✅ UI responsiva con componentes shadcn/ui

PARA USAR EL FORMULARIO:

```tsx
import { TripForm } from '@/features/trips/components/trip-form';
import { CreateTripDTO } from '@/features/trips/interfaces/trips.interface';

const handleCreateTrip = async (data: CreateTripDTO) => {
  try {
    const response = await api.post('/viajes', data);
    console.log('Viaje creado:', response.data);
  } catch (error) {
    console.error('Error creando viaje:', error);
  }
};

export default function CreateTripPage() {
  return (
    <div>
      <h1>Crear Nuevo Viaje</h1>
      <TripForm onSubmit={handleCreateTrip} />
    </div>
  );
}
```

NOTAS IMPORTANTES:
- Los campos requeridos (fecha, horarioRutaId, busId) deben seleccionarse
- Los campos opcionales pueden dejarse vacíos
- El formulario convierte automáticamente los IDs a números
- La fecha se formatea como ISO string
- Se incluyen validaciones client-side con mensajes de error
- El formulario es compatible 100% con tu CreateViajeDto del backend
*/

export {};
