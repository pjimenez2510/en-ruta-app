import NextAuth, { NextAuthOptions } from "next-auth";
import type { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginService } from "@/features/auth/services/auth.service";
import { getUserRoleFromTokenServer } from "@/features/auth/services/jwt.utils.server";
import { jwtDecode } from "jwt-decode";

interface TenantInfo {
  colorPrimario: string;
  colorSecundario: string;
}

interface DecodedToken {
  sub: string;
  tenants: { tenant: TenantInfo }[];
}

declare module "next-auth" {
  interface JWT {
    role?: string;
    accessToken?: string;
    sub?: string;
    tenantInfo?: TenantInfo;
  }
  interface User {
    role?: string;
    accessToken?: string;
    id?: string;
    tenantInfo?: TenantInfo;
  }
  interface Session {
    user: {
      role?: string;
      accessToken?: string;
      id?: string;
      tenantInfo?: TenantInfo;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("=== NextAuth Credentials Provider ===");
        console.log("Credenciales recibidas:", {
          username: credentials?.username ? "Presente" : "Ausente",
          password: credentials?.password ? "Presente" : "Ausente",
        });

        if (!credentials?.username || !credentials?.password) {
          console.log("❌ Credenciales faltantes");
          return null;
        }

        try {
          console.log("🔄 Llamando a loginService...");
          console.log(
            "URL del backend:",
            process.env.NEXT_PUBLIC_BACKEND_API_URL
          );

          // Hacer una llamada directa al backend para verificar
          const testResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: credentials.username,
                password: credentials.password,
              }),
            }
          );

          console.log("Test response status:", testResponse.status);
          const testData = await testResponse.json();
          console.log("Test response data:", JSON.stringify(testData, null, 2));

          const token = await loginService({
            username: credentials.username,
            password: credentials.password,
          });

          console.log("📦 Token recibido:", token ? "✅ Sí" : "❌ No");

          if (!token) {
            console.log("❌ No se recibió token");
            return null;
          }

          const userRole = getUserRoleFromTokenServer(token);
          console.log("👤 Rol de usuario:", userRole);

          const decodedToken = jwtDecode<DecodedToken>(token);
          const tenantInfo = decodedToken.tenants?.[0]?.tenant;

          return {
            id: decodedToken.sub,
            name: credentials.username,
            email: credentials.username,
            role: userRole,
            accessToken: token,
            tenantInfo,
          };
        } catch (error: any) {
          console.error("❌ Error en authorize:", error);
          console.error("Detalles del error:", {
            message: error?.message,
            stack: error?.stack,
            response: error?.response?.data,
          });
          // Propagar el error para que NextAuth lo maneje
          throw new Error(
            error?.response?.data?.message ||
              error?.message ||
              "Error de autenticación"
          );
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("=== JWT Callback ===");
      console.log("Token recibido:", token);
      console.log("Usuario:", user);

      if (user) {
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.tenantInfo = user.tenantInfo;
        console.log("Token actualizado:", token);
      }
      return token;
    },
    async session({ session, token }) {
      console.log("=== Session Callback ===");
      console.log("Session recibida:", session);
      console.log("Token recibido:", token);

      if (token && session.user) {
        session.user.role = token.role as string | undefined;
        session.user.accessToken = token.accessToken as string | undefined;
        session.user.tenantInfo = token.tenantInfo as TenantInfo | undefined;
        console.log("Session actualizada:", session);
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
    signOut: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 horas
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 horas
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  logger: {
    error(code, metadata) {
      console.error("NextAuth Error:", { code, metadata });
    },
    warn(code) {
      console.warn("NextAuth Warning:", code);
    },
    debug(code, metadata) {
      console.log("NextAuth Debug:", { code, metadata });
    },
  },
};
