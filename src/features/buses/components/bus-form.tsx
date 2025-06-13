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
  
  const handleSubmit: SubmitHandler<BusFormValues> = async (values) => {
    try {
      setIsSubmitting(true);

      let imageUrl = values.fotoUrl;

      if (imageFile) {
        const { error } = await supabase.storage
          .from("buses-images")
          .upload(`buses/${values.placa}`, imageFile, {
            cacheControl: "3600",
            upsert: true,
          });

        if (error) throw new Error("Error al cargar la imagen" , error);

        const imageToken = uuidv4();
        const { data: publicUrlData } = supabase.storage
          .from("buses-images")
          .getPublicUrl(`buses/${values.placa}`);

        imageUrl = `${publicUrlData.publicUrl}?v=${imageToken}`;
      }

      await onSubmit({
        ...values,
        fotoUrl: imageUrl
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormFields 
          control={form.control} 
          onImageChange={setImageFile}
          initialImageUrl={initialData?.fotoUrl}
          isEdit={isEdit}
        />
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
  );
}; 