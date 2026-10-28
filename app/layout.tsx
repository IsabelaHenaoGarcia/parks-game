import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parques Online",
  description: "Cliente Next.js para el juego de Parques",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
