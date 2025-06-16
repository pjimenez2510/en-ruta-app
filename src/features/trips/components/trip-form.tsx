"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Trip, CreateTripDTO } from "../interfaces/trips.interface";
import { useEffect } from "react";

const tripSchema = z.object({
  fecha: z.string(),
  horaSalidaReal: z.string().optional(),
  estado: z.string(),
  observaciones: z.string().optional(),
  horarioRutaId: z.string(),
  busId: z.string(),
  conductorId: z.string().optional(),
  ayudanteId: z.string().optional()
});

type TripFormValues = z.infer<typeof tripSchema>;

interface TripFormProps {
  trip?: Trip;
  onSubmit: (data: CreateTripDTO) => Promise<void>;
}

export const TripForm = ({ trip, onSubmit }: TripFormProps) => {
  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      fecha: "",
      horaSalidaReal: "",
      estado: "PROGRAMADO",
      observaciones: "",
      horarioRutaId: "",
      busId: "",
      conductorId: "",
      ayudanteId: ""
    }
  });

  useEffect(() => {
    if (trip) {
      form.reset({
        fecha: new Date(trip.fecha).toISOString().split('T')[0],
        horaSalidaReal: trip.horaSalidaReal || "",
        estado: trip.estado,
        observaciones: trip.observaciones || "",
        horarioRutaId: trip.horarioRuta.id.toString(),
        busId: trip.bus.id.toString(),
        conductorId: trip.conductorId?.toString() || "",
        ayudanteId: trip.ayudanteId?.toString() || ""
      });
    }
  }, [trip, form]);
  const handleSubmit = async (values: TripFormValues) => {
    await onSubmit({
      fecha: values.fecha,
      horaSalidaReal: values.horaSalidaReal || null,
      estado: values.estado as Trip["estado"],
      observaciones: values.observaciones || null,
      horarioRutaId: Number(values.horarioRutaId),
      busId: Number(values.busId),
      conductorId: values.conductorId ? Number(values.conductorId) : null,
      ayudanteId: values.ayudanteId ? Number(values.ayudanteId) : null
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fecha"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="horarioRutaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horario y Ruta</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar horario y ruta" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* Aquí deberías mapear los horarios disponibles */}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="busId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bus</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar bus" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* Aquí deberías mapear los buses disponibles */}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PROGRAMADO">Programado</SelectItem>
                  <SelectItem value="EN_CURSO">En Curso</SelectItem>
                  <SelectItem value="FINALIZADO">Finalizado</SelectItem>
                  <SelectItem value="CANCELADO">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observaciones"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observaciones</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">
            {trip ? "Actualizar" : "Crear"} Viaje
          </Button>
        </div>
      </form>
    </Form>
  );
};
