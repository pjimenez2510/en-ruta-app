"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SeatType } from "../interfaces/seat-type.interface";
import { useSeatTypeForm } from "../hooks/use-seat-types-form";
import { SeatTypeFormValues } from "../interfaces/form-schema";
import { FormFields } from "./seat-type-form-fields";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface SeatTypeFormProps {
  initialData?: SeatType;
  onSubmit: (data: SeatTypeFormValues) => Promise<void>;
  onCancel: () => void;
}

export const SeatTypeForm = ({ initialData, onSubmit, onCancel }: SeatTypeFormProps) => {
  const { form } = useSeatTypeForm(initialData) as { form: UseFormReturn<SeatTypeFormValues> };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isValid } = form.formState;

  const handleSubmit = async (values: SeatTypeFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormFields control={form.control} />
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialData?.id ? "Actualizando..." : "Guardando..."}
              </>
            ) : (
              initialData?.id ? "Actualizar" : "Crear"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};