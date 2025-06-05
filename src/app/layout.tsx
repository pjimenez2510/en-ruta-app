import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthSessionProvider } from "@/features/auth/presentation/providers/session-provider";
import { AuthProvider } from "@/features/auth/presentation/context/auth.provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "EnRuta",
  description: "Aplicación de gestión de rutas de autobuses",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthSessionProvider>
          <AuthProvider>
            <div className="flex min-h-screen">
              <main className="flex-1">{children}</main>
            </div>
          </AuthProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
