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

const paradaFormSchema = z.object({
  ciudadId: z.coerce.number().min(1, "Seleccione una ciudad"),
  orden: z.coerce.number().min(0, "El orden debe ser mayor o igual a 0"),
  distanciaAcumulada: z.coerce.number().min(0, "La distancia debe ser mayor o igual a 0"),
  tiempoAcumulado: z.coerce.number().min(0, "El tiempo debe ser mayor o igual a 0"),
  precioAcumulado: z.coerce.number().min(0, "El precio debe ser mayor o igual a 0"),
});

type ParadaFormValues = z.infer<typeof paradaFormSchema>;

import { useCiudades } from "@/features/auth/hooks/use-ciudades";

interface ParadaFormProps {
  rutaId: number;
  onSubmit: (data: ParadaFormValues) => void;
  defaultValues?: Partial<ParadaFormValues>;
  isEditing?: boolean;
}

export function ParadaForm({
  rutaId,
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="ciudadId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ciudad</FormLabel>              <Select
                onValueChange={(value) => {
                  // Solo actualizar si es un valor numérico válido
                  const numValue = Number(value);
                  if (!isNaN(numValue)) {
                    field.onChange(numValue);
                  }
                }}
                value={field.value > 0 ? field.value.toString() : undefined}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger className={isLoading ? "opacity-50 cursor-not-allowed" : ""}>
                    <SelectValue placeholder={
                      isLoading ? "Cargando ciudades..." : "Seleccione una ciudad"
                    } />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem value="loading" disabled>
                      Cargando ciudades...
                    </SelectItem>
                  ) : ciudadesOptions.length === 0 ? (
                    <SelectItem value="no-data" disabled>
                      No hay ciudades disponibles
                    </SelectItem>
                  ) : (
                    ciudadesOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="orden"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Orden</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="distanciaAcumulada"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Distancia Acumulada (km)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tiempoAcumulado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiempo Acumulado (min)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="precioAcumulado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio Acumulado ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit">
            {isEditing ? "Actualizar" : "Crear"} Parada
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
