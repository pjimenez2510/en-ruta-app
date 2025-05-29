"use client";
import { jwtDecode } from "jwt-decode";

export interface JwtPayload {
  sub: string;
  exp: number;
  iat: number;
  TipoUsuario?: string;
  [key: string]: unknown;
}

export function getUserRoleFromToken(
  token: string | undefined | null
): string | undefined {
  if (!token || typeof token !== "string") {
    //console.error("[DEBUG] Token inválido para decodificar:", token);
    return undefined;
  }
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    //console.log("[DEBUG] Decoded JWT:", JSON.stringify(decoded, null, 2));
    if (typeof decoded.TipoUsuario === "string") return decoded.TipoUsuario;
    if (typeof (decoded as Record<string, unknown>)["tipoUsuario"] === "string")
      return (decoded as Record<string, unknown>)["tipoUsuario"] as string;
    if (typeof (decoded as Record<string, unknown>)["role"] === "string")
      return (decoded as Record<string, unknown>)["role"] as string;
    return undefined;
  } catch (e) {
    //console.error("[DEBUG] Error decoding JWT:", e);
    return undefined;
  }
}
