"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SeatType } from "../interfaces/seat-type.interface";
import { useSeatTypeForm } from "../hooks/use-seat-types-form";
import { SeatTypeFormValues } from "../interfaces/form-schema";
import { FormFields } from "./seat-type-form-fields";

interface SeatTypeFormProps {
  initialData?: SeatType;
  onSubmit: (data: Partial<SeatType>) => void;
  onCancel: () => void;
}

export const SeatTypeForm = ({
  initialData,
  onSubmit,
  onCancel,
}: SeatTypeFormProps) => {
  const { form, tenantId } = useSeatTypeForm(initialData);

  const handleSubmit = (values: SeatTypeFormValues) => {
    if (!initialData && tenantId === null) {
      console.error("Tenant ID no disponible");
      return;
    }

    const submitData = initialData
      ? {
          ...values,
          tenantId: initialData.tenantId,
          activo: initialData.activo,
        }
      : values;

    onSubmit(submitData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormFields control={form.control} />
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{initialData ? "Actualizar" : "Crear"}</Button>
        </div>
      </form>
    </Form>
  );
};
