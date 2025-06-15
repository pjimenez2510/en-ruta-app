"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

const formSchema = z.object({
  origen: z.string().min(1, {
    message: "El origen es requerido.",
  }),
  destino: z.string().min(1, {
    message: "El destino es requerido.",
  }),
  horaSalida: z.string().min(1, {
    message: "La hora de salida es requerida.",
  }),
  duracionEstimada: z.string().min(1, {
    message: "La duración estimada es requerida.",
  }),
  precio: z.string().min(1, {
    message: "El precio es requerido.",
  }),
  resolucionANT: z.string().min(1, {
    message: "La resolución ANT es requerida.",
  }),
  diasOperacion: z.array(z.string()).min(1, {
    message: "Seleccione al menos un día de operación.",
  }),
  paradas: z.array(z.string()).optional(),
  observaciones: z.string().optional(),
  estado: z.boolean(),
});

const ciudades = [
  "Ambato",
  "Quito",
  "Guayaquil",
  "Cuenca",
  "Riobamba",
  "Latacunga",
  "Loja",
  "Esmeraldas",
  "Manta",
  "Machala",
  "Santo Domingo",
  "Ibarra",
  "Tulcán",
  "Babahoyo",
  "Milagro",
  "Cañar",
  "Azogues",
];

const diasSemana = [
  { id: "lunes", label: "Lunes" },
  { id: "martes", label: "Martes" },
  { id: "miercoles", label: "Miércoles" },
  { id: "jueves", label: "Jueves" },
  { id: "viernes", label: "Viernes" },
  { id: "sabado", label: "Sábado" },
  { id: "domingo", label: "Domingo" },
];

export function FrecuenciaForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [paradas, setParadas] = useState<string[]>([]);
  const [nuevaParada, setNuevaParada] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origen: "",
      destino: "",
      horaSalida: "",
      duracionEstimada: "",
      precio: "",
      resolucionANT: "",
      diasOperacion: [],
      paradas: [],
      observaciones: "",
      estado: true,
    },
  });

  const agregarParada = () => {
    if (nuevaParada && !paradas.includes(nuevaParada)) {
      const nuevasParadas = [...paradas, nuevaParada];
      setParadas(nuevasParadas);
      form.setValue("paradas", nuevasParadas);
      setNuevaParada("");
    }
  };

  const eliminarParada = (index: number) => {
    const nuevasParadas = paradas.filter((_, i) => i !== index);
    setParadas(nuevasParadas);
    form.setValue("paradas", nuevasParadas);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    // Simulación de envío de datos
    setTimeout(() => {
      console.log(values);
      setIsLoading(false);
      toast.success("La frecuencia ha sido registrada exitosamente.");
      router.push("/dashboard/frecuencias");
    }, 1000);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de la Frecuencia</CardTitle>
        <CardDescription>
          Complete todos los campos para registrar una nueva frecuencia.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="origen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciudad de Origen</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione la ciudad de origen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ciudades.map((ciudad) => (
                          <SelectItem key={ciudad} value={ciudad}>
                            {ciudad}
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
                name="destino"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciudad de Destino</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione la ciudad de destino" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ciudades.map((ciudad) => (
                          <SelectItem key={ciudad} value={ciudad}>
                            {ciudad}
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
                name="horaSalida"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de Salida</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duracionEstimada"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duración Estimada</FormLabel>
                    <FormControl>
                      <Input placeholder="3h 30m" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="precio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio del Boleto ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="12.50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="resolucionANT"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resolución ANT</FormLabel>
                    <FormControl>
                      <Input placeholder="ANT-2024-0123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="diasOperacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Días de Operación</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                      {diasSemana.map((dia) => (
                        <div
                          key={dia.id}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            id={dia.id}
                            checked={field.value?.includes(dia.id) || false}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              const currentValue = field.value || [];
                              if (checked) {
                                field.onChange([...currentValue, dia.id]);
                              } else {
                                field.onChange(
                                  currentValue.filter(
                                    (value) => value !== dia.id
                                  )
                                );
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={dia.id} className="text-sm">
                            {dia.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <Label>Paradas Intermedias</Label>
              <div className="flex gap-2 mt-2">
                <Select value={nuevaParada} onValueChange={setNuevaParada}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Seleccione una parada" />
                  </SelectTrigger>
                  <SelectContent>
                    {ciudades
                      .filter(
                        (ciudad) =>
                          ciudad !== form.watch("origen") &&
                          ciudad !== form.watch("destino") &&
                          !paradas.includes(ciudad)
                      )
                      .map((ciudad) => (
                        <SelectItem key={ciudad} value={ciudad}>
                          {ciudad}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={agregarParada}
                  disabled={!nuevaParada}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {paradas.length > 0 && (
                <div className="mt-3 space-y-2">
                  {paradas.map((parada, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <span>{parada}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => eliminarParada(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ingrese cualquier observación relevante sobre la frecuencia"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-2">
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Frecuencia Activa</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/frecuencias")}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar Frecuencia"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
