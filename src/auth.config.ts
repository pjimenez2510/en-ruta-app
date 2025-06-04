import NextAuth from "next-auth";
import type { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginService } from "@/features/auth/services/auth.service";
import { getUserRoleFromToken } from "@/features/auth/services/jwt.utils";

declare module "next-auth" {
  interface JWT {
    role?: string;
    accessToken?: string;
    sub?: string;
  }
  interface User {
    role?: string;
    token?: string;
    id?: string;
  }
  interface Session {
    user: {
      role?: string;
      accessToken?: string;
      id?: string;
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
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Credenciales requeridas");
        }

        try {
          const token = await loginService({
            username: credentials.username,
            password: credentials.password,
          });

          const userRole = getUserRoleFromToken(token);

          return {
            id: credentials.username,
            name: credentials.username,
            email: credentials.username,
            role: userRole,
            token: token,
          };
        } catch (error) {
          throw new Error("Credenciales inválidas");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.accessToken = user.token;
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string | undefined;
        session.user.accessToken = token.accessToken as string | undefined;
        session.user.id = token.sub as string | undefined;
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
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
