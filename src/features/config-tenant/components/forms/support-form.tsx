import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  SupportFormValues,
  soporteFormSchema,
} from "@/features/config-tenant/schemas/tenant.schemas";

interface SupportFormProps {
  initialData?: Partial<SupportFormValues>;
  onSubmit: (values: SupportFormValues) => Promise<void>;
  isLoading: boolean;
}

export const SupportForm = ({
  initialData,
  onSubmit,
  isLoading,
}: SupportFormProps) => {
  const form = useForm<SupportFormValues>({
    resolver: zodResolver(soporteFormSchema),
    defaultValues: {
      emailSoporte: initialData?.emailSoporte || "",
      telefonoSoporte: initialData?.telefonoSoporte || "",
      horarioAtencion: initialData?.horarioAtencion || "",
    },
  });

  const handleSubmit = async (values: SupportFormValues) => {
    try {
      // Solo enviamos los valores que no estén vacíos
      const valuesToSubmit = Object.fromEntries(
        Object.entries(values).filter(([, value]) => value !== "")
      ) as SupportFormValues;

      await onSubmit(valuesToSubmit);
      toast.success("La información de soporte ha sido actualizada.");
    } catch (error) {
      console.error("Error al guardar la información de soporte:", error);
      toast.error("Ocurrió un error al guardar los cambios");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Soporte</CardTitle>
        <CardDescription>
          Configure la información de soporte para sus usuarios. Puede completar
          uno o más campos según necesite.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="emailSoporte"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo de Soporte</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="soporte@ejemplo.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefonoSoporte"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono de Soporte</FormLabel>
                    <FormControl>
                      <Input placeholder="+593..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="horarioAtencion"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Horario de Atención</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ej: Lunes a Viernes: 8:00 - 17:00, Sábados: 8:00 - 12:00"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SupportForm;
