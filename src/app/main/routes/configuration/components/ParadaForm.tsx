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
} from "@/shared/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { DialogFooter } from "@/shared/components/ui/dialog";

const paradaFormSchema = z.object({
  ciudadId: z.coerce.number().min(1, "Seleccione una ciudad"),
  orden: z.coerce.number().min(0, "El orden debe ser mayor o igual a 0"),
  distanciaAcumulada: z.coerce.number().min(0, "La distancia debe ser mayor o igual a 0"),
  tiempoAcumulado: z.coerce.number().min(0, "El tiempo debe ser mayor o igual a 0"),
  precioAcumulado: z.coerce.number().min(0, "El precio debe ser mayor o igual a 0"),
});

type ParadaFormValues = z.infer<typeof paradaFormSchema>;

interface Ciudad {
  id: number;
  nombre: string;
}

interface ParadaFormProps {
  rutaId: number;
  onSubmit: (data: ParadaFormValues) => void;
  defaultValues?: Partial<ParadaFormValues>;
  isEditing?: boolean;
  ciudades: Ciudad[];
}

export function ParadaForm({
  rutaId,
  onSubmit,
  defaultValues,
  isEditing = false,
  ciudades,
}: ParadaFormProps) {
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
              <FormLabel>Ciudad</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una ciudad" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ciudades.map((ciudad) => (
                    <SelectItem key={ciudad.id} value={ciudad.id.toString()}>
                      {ciudad.nombre}
                    </SelectItem>
                  ))}
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
