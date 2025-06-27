"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import { useBusForm } from "../hooks/use-bus-form";
import { BusFormValues } from "../interfaces/form-schema";
import { FormFields } from "./bus-form-fields";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { SubmitHandler } from "react-hook-form";
import { supabase } from "@/shared/services/storage.service";
import { v4 as uuidv4 } from "uuid";
import { Card } from "@/components/ui/card";
import { useBusValidation } from "../hooks/use-bus-validation";
import { toast } from "sonner";

interface BusFormProps {
  initialData?: BusFormValues & { id?: string };
  onSubmit: (data: BusFormValues) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

export const BusForm = ({ initialData, onSubmit, onCancel, isEdit = false }: BusFormProps) => {
  const { form } = useBusForm(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { validateBusExists } = useBusValidation();
  
  const handleSubmit: SubmitHandler<BusFormValues> = async (values) => {
    try {
      setIsSubmitting(true);

      // Validar existencia de bus
      const validation = await validateBusExists(
        values.numero, 
        values.placa, 
        initialData?.id
      );

      if (validation.exists) {
        setIsSubmitting(false);
        const message = validation.field === "numero" 
          ? `Ya existe un bus con el número ${values.numero}`
          : `Ya existe un bus con la placa ${values.placa}`;

        toast.error("Error de validación", {
          description: message,
          duration: 5000,
        });
        return;
      }

      let imageUrl = values.fotoUrl;

      if (imageFile) {
        try {
          const { error } = await supabase.storage
            .from("buses-images")
            .upload(`buses/${values.placa}`, imageFile, {
              cacheControl: "3600",
              upsert: true,
            });

          if (error) {
            throw error;
          }

          const imageToken = uuidv4();
          const { data: publicUrlData } = supabase.storage
            .from("buses-images")
            .getPublicUrl(`buses/${values.placa}`);

          imageUrl = `${publicUrlData.publicUrl}?v=${imageToken}`;
        } catch (error) {
          toast.error("Error al cargar la imagen", {
            description: "No se pudo cargar la imagen del bus. Por favor, intente nuevamente.",
            duration: 5000,
          });
          console.log(error);
          return;
        }
      }

      await onSubmit({
        ...values,
        fotoUrl: imageUrl
      });
    } catch (error) {
      toast.error("Error al guardar", {
        description: "Ocurrió un error al guardar los datos del bus. Por favor, intente nuevamente.",
        duration: 5000,
      });
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormFields 
              control={form.control} 
              onImageChange={setImageFile}
              initialImageUrl={initialData?.fotoUrl}
              isEdit={isEdit}
            />
            <div className="flex justify-start">
              <p className="text-xs text-gray-500">
                Los campos marcados con <span className="text-red-500">*</span> son obligatorios
              </p>
            </div>
            <div className="flex justify-end space-x-4 pt-4 border-t">
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
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEdit ? "Actualizando..." : "Guardando..."}
                  </>
                ) : (
                  isEdit ? "Actualizar" : "Siguiente"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}; 