"use client";

import type { Metadata } from "next";
import { Exo_2, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NavBar from "@/components/NavBar";

const exo2 = Exo_2({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });
  return (
    <html lang="en" className="dark" data-them="dark">
      <body className={`text-foreground bg-background ${exo2.className}`}>
        <QueryClientProvider client={queryClient}>
          <NavBar />
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
