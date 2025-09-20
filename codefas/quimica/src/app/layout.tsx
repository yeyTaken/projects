import type { Metadata } from "next";

import "../../public/styles/globals.css";

import { Providers } from "@/components/root/leyout"
import Footer from "@/components/layouts/footer";

export const metadata: Metadata = {
  title: "CODEFAS — Química",
  description: "site do colegio CODEFAS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  );
}
