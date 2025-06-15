import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploaderProps {
  imageUrl: string | null;
  onImageUpload: (url: string) => void;
  aspectRatio?: number;
  width?: number;
  height?: number;
  className?: string;
  buttonText?: string;
  folder?: string;
}

export const ImageUploader = ({
  imageUrl,
  onImageUpload,
  aspectRatio = 1,
  width = 200,
  height = 200,
  className = "",
  buttonText = "Cambiar Imagen",
  folder = "en-ruta",
}: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = (result: any) => {
    if (result.info && result.info.secure_url) {
      onImageUpload(result.info.secure_url);
    }
    setIsUploading(false);
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-4">
        <div
          className="rounded-md border flex items-center justify-center bg-gray-50 overflow-hidden"
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Imagen subida"
              className="h-full w-full object-contain p-1"
            />
          ) : (
            <Upload className="h-8 w-8 text-gray-400" />
          )}
        </div>
        <div className="relative">
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            options={{
              maxFiles: 1,
              resourceType: "image",
              folder: folder,
              cropping: true,
              showSkipCropButton: false,
              croppingAspectRatio: aspectRatio,
              clientAllowedFormats: ["image/jpeg", "image/png", "image/webp"],
            }}
            onUpload={(result) => handleUpload(result)}
          >
            {({ open }) => (
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => {
                  setIsUploading(true);
                  open();
                }}
                disabled={isUploading}
              >
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? "Subiendo..." : buttonText}
              </Button>
            )}
          </CldUploadWidget>
        </div>
      </div>
    </div>
  );
};
