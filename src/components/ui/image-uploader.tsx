import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploaderProps {
  imageUrl: string | null;
  onImageUpload: (url: string) => void;
  onCancel?: () => void;
  aspectRatio?: number;
  width?: number;
  height?: number;
  className?: string;
  buttonText?: string;
  folder?: string;
}

interface CloudinaryUploadResult {
  info?:
    | {
        secure_url: string;
      }
    | string
    | undefined;
}

export const ImageUploader = ({
  imageUrl,
  onImageUpload,
  onCancel,
  aspectRatio = 1,
  width = 200,
  height = 200,
  className = "",
  buttonText = "Cambiar Imagen",
  folder = "en-ruta",
}: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = (result: CloudinaryUploadResult) => {
    console.log("Upload result:", result);
    if (
      result.info &&
      typeof result.info === "object" &&
      result.info.secure_url
    ) {
      onImageUpload(result.info.secure_url);
    }
    setIsUploading(false);
  };

  const handleCancel = () => {
    setIsUploading(false);
    onCancel?.();
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

        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          options={{
            maxFiles: 1,
            resourceType: "image",
            folder: folder,
            cropping: false,
            showSkipCropButton: false,
            croppingAspectRatio: aspectRatio,
            clientAllowedFormats: ["image/jpeg", "image/png", "image/webp"],
          }}
          onSuccess={(result) => {
            console.log("Upload success:", result);
            handleUpload(result);
          }}
          onError={(error) => {
            console.error("Upload error:", error);
            handleCancel();
          }}
          onClose={() => {
            console.log("Upload widget closed");
            setIsUploading(false);
          }}
        >
           {({ open }) => (
    <div onClick={(e) => e.stopPropagation()}>
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
    </div>
  )}
        </CldUploadWidget>
      </div>
    </div>
  );
};
