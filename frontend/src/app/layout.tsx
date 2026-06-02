import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Providers from "@/providers/Providers";

const exo2 = Exo_2({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tasas Venezuela — Tasas de cambio del BCV",
  description:
    "Consulta las tasas de cambio oficiales del Banco Central de Venezuela en tiempo real. Dólar, Euro, Lira y Rublo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`text-foreground bg-background ${exo2.className}`}>
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
