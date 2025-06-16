import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { MapPin, Route, Clock, DollarSign, Hash } from "lucide-react";

const paradaFormSchema = z.object({
  ciudadId: z.coerce.number().min(1, "Seleccione una ciudad"),
  orden: z.coerce.number().min(0, "El orden debe ser mayor o igual a 0"),
  distanciaAcumulada: z.coerce.number().min(0, "La distancia debe ser mayor o igual a 0"),
  tiempoAcumulado: z.coerce.number().min(0, "El tiempo debe ser mayor o igual a 0"),
  precioAcumulado: z.coerce.number().min(0, "El precio debe ser mayor o igual a 0"),
});

type ParadaFormValues = z.infer<typeof paradaFormSchema>;

import { useCiudades } from "@/features/auth/hooks/use-ciudades";
import { ControllerRenderProps, FieldPath } from "react-hook-form";

interface ParadaFormProps {
  rutaId: number;
  onSubmit: (data: ParadaFormValues) => void;
  defaultValues?: Partial<ParadaFormValues>;
  isEditing?: boolean;
}

export function ParadaForm({
  onSubmit,
  defaultValues,
  isEditing = false,
}: ParadaFormProps) {
  const { ciudadesOptions, isLoading } = useCiudades();
  const form = useForm<ParadaFormValues>({
    resolver: zodResolver(paradaFormSchema),
    defaultValues: {
      ciudadId: defaultValues?.ciudadId || 0,
      orden: defaultValues?.orden || 0,
      distanciaAcumulada: defaultValues?.distanciaAcumulada || 0,
      tiempoAcumulado: defaultValues?.tiempoAcumulado || 0,
      precioAcumulado: defaultValues?.precioAcumulado || 0,
    },
  });

  // Función para manejar input numérico que bloquea letras
  const handleNumericInput = (
    e: React.KeyboardEvent<HTMLInputElement>,
    allowDecimals = false
  ) => {
    const key = e.key;
    const value = e.currentTarget.value;
    
    // Permitir teclas de control
    if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) {
      return;
    }
    
    // Permitir Ctrl+A, Ctrl+C, Ctrl+V, etc.
    if (e.ctrlKey || e.metaKey) {
      return;
    }
    
    // Solo permitir números
    if (!/^\d$/.test(key)) {
      // Si se permiten decimales, permitir punto solo si no hay uno ya
      if (allowDecimals && key === '.' && !value.includes('.')) {
        return;
      }
      e.preventDefault();
    }
  };

  // Función para limpiar valor no numérico al perder foco
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    field: ControllerRenderProps<ParadaFormValues, FieldPath<ParadaFormValues>>,
    allowDecimals = false
  ) => {
    const value = e.target.value;
    if (value === '') {
      field.onChange(0);
      return;
    }
    
    const numValue = allowDecimals ? parseFloat(value) : parseInt(value);
    if (isNaN(numValue) || numValue < 0) {
      field.onChange(0);
    } else {
      field.onChange(numValue);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Campo Ciudad */}
        <FormField
          control={form.control}
          name="ciudadId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-sm font-medium">
                <MapPin size={16} className="text-blue-600" />
                Ciudad
              </FormLabel>
              <Select
                onValueChange={(value) => {
                  const numValue = Number(value);
                  if (!isNaN(numValue)) {
                    field.onChange(numValue);
                  }
                }}
                value={field.value > 0 ? field.value.toString() : undefined}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger 
                    className={`h-11 ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 transition-colors"}`}
                  >
                    <SelectValue 
                      placeholder={isLoading ? "Cargando ciudades..." : "Seleccione una ciudad"} 
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem value="loading" disabled>
                      <div className="flex items-center gap-2">
                        <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
                        Cargando ciudades...
                      </div>
                    </SelectItem>
                  ) : ciudadesOptions.length === 0 ? (
                    <SelectItem value="no-data" disabled>
                      <div className="flex items-center gap-2 text-gray-500">
                        <MapPin size={16} />
                        No hay ciudades disponibles
                      </div>
                    </SelectItem>
                  ) : (
                    ciudadesOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-gray-400" />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Grid para campos numéricos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Campo Orden */}
          <FormField
            control={form.control}
            name="orden"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                  <Hash size={16} className="text-purple-600" />
                  Orden
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="text"
                      inputMode="numeric"
                      className="h-11 pl-4 pr-8 transition-all hover:bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0"
                      value={field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^\d+$/.test(value)) {
                          field.onChange(value === '' ? 0 : parseInt(value));
                        }
                      }}
                      onKeyDown={(e) => handleNumericInput(e)}
                      onBlur={(e) => handleBlur(e, field)}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
                      #
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo Tiempo */}
          <FormField
            control={form.control}
            name="tiempoAcumulado"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                  <Clock size={16} className="text-green-600" />
                  Tiempo Acumulado
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="text"
                      inputMode="numeric"
                      className="h-11 pl-4 pr-12 transition-all hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0"
                      value={field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^\d+$/.test(value)) {
                          field.onChange(value === '' ? 0 : parseInt(value));
                        }
                      }}
                      onKeyDown={(e) => handleNumericInput(e)}
                      onBlur={(e) => handleBlur(e, field)}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs font-medium">
                      min
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Campo Distancia */}
          <FormField
            control={form.control}
            name="distanciaAcumulada"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                  <Route size={16} className="text-orange-600" />
                  Distancia Acumulada
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="text"
                      inputMode="decimal"
                      className="h-11 pl-4 pr-10 transition-all hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="0.0"
                      value={field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                          field.onChange(value === '' ? 0 : parseFloat(value) || 0);
                        }
                      }}
                      onKeyDown={(e) => handleNumericInput(e, true)}
                      onBlur={(e) => handleBlur(e, field, true)}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs font-medium">
                      km
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo Precio */}
          <FormField
            control={form.control}
            name="precioAcumulado"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                  <DollarSign size={16} className="text-emerald-600" />
                  Precio Acumulado
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      $
                    </div>
                    <Input
                      type="text"
                      inputMode="decimal"
                      className="h-11 pl-8 pr-4 transition-all hover:bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="0.00"
                      value={field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                          field.onChange(value === '' ? 0 : parseFloat(value) || 0);
                        }
                      }}
                      onKeyDown={(e) => handleNumericInput(e, true)}
                      onBlur={(e) => handleBlur(e, field, true)}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="pt-6">
          <Button 
            type="submit" 
            className="w-full md:w-auto min-w-32 h-11 bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            {isEditing ? "Actualizar" : "Crear"} Parada
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}