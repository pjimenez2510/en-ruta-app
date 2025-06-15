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
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { DialogFooter } from "@/shared/components/ui/dialog";
import { Checkbox } from "@/shared/components/ui/checkbox";

const horarioFormSchema = z.object({
  horaSalida: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:mm)"),
  diasSemana: z.array(z.boolean()).length(7, "Debe seleccionar los días de la semana"),
  activo: z.boolean(),
});

type FormValues = z.infer<typeof horarioFormSchema>;

const diasSemana = [
  { label: "Lunes", value: 0 },
  { label: "Martes", value: 1 },
  { label: "Miércoles", value: 2 },
  { label: "Jueves", value: 3 },
  { label: "Viernes", value: 4 },
  { label: "Sábado", value: 5 },
  { label: "Domingo", value: 6 },
] as const;

interface HorarioFormProps {
  rutaId: number;
  onSubmit: (data: FormValues) => void;
  defaultValues?: Partial<FormValues>;
  isEditing?: boolean;
}

export function HorarioForm({
  rutaId,
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="horaSalida"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hora de Salida</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Días de la Semana</FormLabel>
          <FormDescription>
            Seleccione los días en que opera este horario
          </FormDescription>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {diasSemana.map((dia, index) => (
              <FormField
                key={dia.value}
                control={form.control}
                name={`diasSemana.${index}`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {dia.label}
                    </FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <FormField
          control={form.control}
          name="activo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal">
                Horario activo
              </FormLabel>
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit">
            {isEditing ? "Actualizar" : "Crear"} Horario
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
