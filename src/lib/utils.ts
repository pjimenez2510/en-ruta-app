import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Función para calcular el contraste y determinar si el texto debe ser claro u oscuro
export function getContrastColor(hexColor: string): string {
  // Remover el # si existe
  const hex = hexColor.replace("#", "");

  // Convertir a RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calcular la luminosidad usando la fórmula YIQ
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // Retornar blanco o negro basado en la luminosidad
  return yiq >= 128 ? "#000000" : "#ffffff";
}
