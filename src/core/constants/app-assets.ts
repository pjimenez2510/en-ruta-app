export const CLOUDINARY_URL =
  "https://res.cloudinary.com/db8h7lkin/image/upload";

export const APP_ASSETS = {
  IMAGES: {
    LOGO: `${CLOUDINARY_URL}/v1748065636/logo_lik2hw.png`,
    ONLY_LOGO: `${CLOUDINARY_URL}/v1748065636/logo_lik2hw.png`,
  },
} as const;

// Ejemplo de uso:
// import { APP_ASSETS } from "@/core/constants/app-assets";
// <img src={APP_ASSETS.IMAGES.LOGO} alt="Logo" />
