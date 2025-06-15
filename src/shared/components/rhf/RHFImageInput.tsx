/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FormImageInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

const RHFImageInput: React.FC<FormImageInputProps> = ({
  name,
  label,
  placeholder,
  disabled = false,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const [imageError, setImageError] = useState<boolean>(false);

  const getErrorMessage = (name: string): string | undefined => {
    const error = errors[name];
    return error && typeof error.message === "string"
      ? error.message
      : undefined;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  return (
    <div className="w-full space-y-1">
      {label && (
        <Label htmlFor={name} className="ml-1">
          {label}
        </Label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <div className="relative rounded-lg overflow-hidden border border-gray-200">
              <img
                src={field.value || ""}
                alt="Preview"
                className="w-full h-60 object-cover"
                onError={handleImageError}
                onLoad={handleImageLoad}
                style={{ display: imageError ? "none" : "block" }}
              />
              {imageError && (
                <div className="w-full h-60 bg-gray-100 flex items-center justify-center text-gray-500 dark:bg-gray-950 dark:text-gray-50">
                  URL de imagen inválida
                </div>
              )}
            </div>
            <Input
              {...field}
              id={name}
              type="text"
              placeholder={placeholder}
              disabled={disabled}
              value={field.value || ""}
            />
          </div>
        )}
      />
      <p className="text-sm text-red-500">&nbsp; {getErrorMessage(name)}</p>
    </div>
  );
};

export default RHFImageInput;
