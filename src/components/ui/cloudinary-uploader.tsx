import React, { useRef } from "react";
import { Button } from "./button";
import { Label } from "./label";
import { Image } from "lucide-react";

interface CloudinaryUploaderProps {
  imageUrl: string | null;
  onImageUpload: (url: string) => void;
  folder: string;
  className?: string;
}

export const CloudinaryUploader: React.FC<CloudinaryUploaderProps> = ({
  imageUrl,
  onImageUpload,
  folder,
  className = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
      );
      formData.append("folder", folder);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        onImageUpload(data.secure_url);
      }
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>Foto de Perfil</Label>
      <div className="flex items-center gap-4">
        {imageUrl && (
          <div className="relative w-20 h-20">
            <img
              src={imageUrl}
              alt="Foto de perfil"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2"
        >
          <Image className="h-4 w-4" />
          {imageUrl ? "Cambiar imagen" : "Subir imagen"}
        </Button>
      </div>
    </div>
  );
};
