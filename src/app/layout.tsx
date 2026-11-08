import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Consola de chat con Groq",
  description: "Prototipo de interfaz de chat con métricas de consumo de tokens de la API de Groq.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full bg-stone-50 text-stone-900">{children}</body>
    </html>
  );
}
