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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Calendar, Power, CheckCircle2 } from "lucide-react";

const horarioFormSchema = z.object({
  horaSalida: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:mm)"),
  diasSemana: z.array(z.boolean()).length(7, "Debe seleccionar los días de la semana"),
  activo: z.boolean(),
});

type FormValues = z.infer<typeof horarioFormSchema>;

const diasSemana = [
  { label: "Lunes", value: 0, short: "L", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { label: "Martes", value: 1, short: "M", color: "bg-green-100 text-green-700 border-green-200" },
  { label: "Miércoles", value: 2, short: "X", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { label: "Jueves", value: 3, short: "J", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { label: "Viernes", value: 4, short: "V", color: "bg-pink-100 text-pink-700 border-pink-200" },
  { label: "Sábado", value: 5, short: "S", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  { label: "Domingo", value: 6, short: "D", color: "bg-red-100 text-red-700 border-red-200" },
] as const;

interface HorarioFormProps {
  rutaId: number;
  onSubmit: (data: FormValues) => void;
  defaultValues?: Partial<FormValues>;
  isEditing?: boolean;
}

export function HorarioForm({
  onSubmit,
  defaultValues,
  isEditing = false,
}: HorarioFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(horarioFormSchema),
    defaultValues: {
      horaSalida: defaultValues?.horaSalida || "",
      diasSemana: defaultValues?.diasSemana || Array(7).fill(false),
      activo: defaultValues?.activo ?? true,
    },
  });

  const selectedDays = form.watch("diasSemana");
  const selectedCount = selectedDays.filter(Boolean).length;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Campo Hora de Salida */}
        <FormField
          control={form.control}
          name="horaSalida"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-sm font-medium">
                <Clock size={16} className="text-blue-600" />
                Hora de Salida
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="time"
                    className="h-11 pl-4 pr-12 text-lg font-mono tracking-wider transition-all hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...field}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Clock size={18} className="text-gray-400" />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Días de la Semana */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel className="flex items-center gap-2 text-sm font-medium">
              <Calendar size={16} className="text-purple-600" />
              Días de la Semana
            </FormLabel>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {selectedCount} de 7 seleccionados
              </span>
              {selectedCount > 0 && (
                <CheckCircle2 size={14} className="text-green-500" />
              )}
            </div>
          </div>
          
          <FormDescription className="text-sm text-gray-600">
            Seleccione los días en que opera este horario
          </FormDescription>

          {/* Grid responsivo de días */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {diasSemana.map((dia, index) => (
              <FormField
                key={dia.value}
                control={form.control}
                name={`diasSemana.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <label 
                        className={`
                          flex flex-col items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md
                          ${field.value 
                            ? `${dia.color} border-opacity-100 shadow-sm scale-105` 
                            : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                          }
                        `}
                      >
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="sr-only"
                        />
                        <span className="text-lg font-bold mb-1">
                          {dia.short}
                        </span>
                        <span className="text-xs font-medium text-center leading-tight">
                          {dia.label}
                        </span>
                        {field.value && (
                          <CheckCircle2 size={14} className="mt-1 opacity-70" />
                        )}
                      </label>
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </div>

          {/* Botones de selección rápida */}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs"
              onClick={() => {
                const weekdays = Array(7).fill(false);
                weekdays[0] = weekdays[1] = weekdays[2] = weekdays[3] = weekdays[4] = true; // L-V
                form.setValue("diasSemana", weekdays);
              }}
            >
              Solo Semana
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs"
              onClick={() => {
                const weekend = Array(7).fill(false);
                weekend[5] = weekend[6] = true; // S-D
                form.setValue("diasSemana", weekend);
              }}
            >
              Solo Fines
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs"
              onClick={() => {
                form.setValue("diasSemana", Array(7).fill(true));
              }}
            >
              Todos
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs"
              onClick={() => {
                form.setValue("diasSemana", Array(7).fill(false));
              }}
            >
              Ninguno
            </Button>
          </div>
        </div>

        {/* Estado Activo */}
        <FormField
          control={form.control}
          name="activo"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                  <Power 
                    size={20} 
                    className={field.value ? "text-green-600" : "text-gray-400"} 
                  />
                  <div>
                    <FormLabel className="text-sm font-medium cursor-pointer">
                      Estado del Horario
                    </FormLabel>
                    <FormDescription className="text-xs text-gray-600 mt-1">
                      {field.value ? "El horario está activo y visible" : "El horario está desactivado"}
                    </FormDescription>
                  </div>
                </div>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${field.value ? 'text-green-600' : 'text-gray-500'}`}>
                      {field.value ? 'Activo' : 'Inactivo'}
                    </span>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="w-5 h-5"
                    />
                  </div>
                </FormControl>
              </div>
            </FormItem>
          )}
        />

        <DialogFooter className="pt-6">
          <Button 
            type="submit" 
            className="w-full md:w-auto min-w-32 h-11 bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            {isEditing ? "Actualizar" : "Crear"} Horario
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}