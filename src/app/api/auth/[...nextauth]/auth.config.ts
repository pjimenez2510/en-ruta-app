import { NextAuthOptions } from "next-auth";
import type { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginService } from "@/features/auth/services/auth.service";
import {
  getUserRoleFromTokenServer,
  getUserTenantIdFromTokenServer,
} from "@/features/auth/services/jwt.utils.server";

declare module "next-auth" {
  interface JWT {
    role?: string;
    accessToken?: string;
    sub?: string;
    tenantId?: number;
    logoUrl?: string;
  }
  interface User {
    role?: string;
    token?: string;
    id?: string;
    tenantId?: number;
    logoUrl?: string;
  }
  interface Session {
    user: {
      role?: string;
      accessToken?: string;
      id?: string;
      tenantId?: number;
      logoUrl?: string;
    } & DefaultSession["user"];
  }
}

interface AuthError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
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
          const userTenantId = getUserTenantIdFromTokenServer(token);
          console.log("👤 Rol de usuario:", userRole);
          console.log("👤 Tenant de usuario:", userTenantId);

          return {
            id: credentials.username,
            name: credentials.username,
            email: credentials.username,
            role: userRole,
            token: token,
            tenantId: userTenantId,
          };
        } catch (error: unknown) {
          console.error("❌ Error en authorize:", error);
          const authError = error as AuthError;
          console.error("Detalles del error:", {
            message: authError?.message,
            stack: authError?.stack,
            response: authError?.response?.data,
          });
          // Propagar el error para que NextAuth lo maneje
          throw new Error(
            authError?.response?.data?.message ||
              authError?.message ||
              "Error de autenticación"
          );
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      console.log("=== JWT Callback ===");
      console.log("Token recibido:", token);
      console.log("Usuario:", user);
      console.log("Cuenta:", account);

      if (user) {
        token.role = user.role;
        token.accessToken = user.token;
        token.sub = user.id;
        token.tenantId = user.tenantId;
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
        session.user.id = token.sub as string | undefined;
        session.user.tenantId = token.tenantId as number | undefined;
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
