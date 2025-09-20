import type { Metadata } from "next";

import "../../public/styles/globals.css";

import { Providers } from "@/components/root/leyout";
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
  const BackgroundAnimation = () => (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute w-32 h-32 bg-blue-500/20 rounded-full animate-bounce-slow top-10 left-10"></div>
      <div className="absolute w-20 h-20 bg-green-400/20 rounded-full animate-bounce-slower bottom-20 right-20"></div>
      <div className="absolute w-16 h-16 bg-purple-500/20 rounded-full animate-bounce-slowest top-1/3 left-1/2"></div>
    </div>
  );
  return (
    <html lang="pt-BR">
      <body
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <BackgroundAnimation />
          {children}
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
