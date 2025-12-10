// app/layout.tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./style/globals.css";

import { CartProvider } from "./context/CartContext";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "K-Shop",
  description: "Beautiful iOS-style shopping app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased bg-slate-50">
        <SessionProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}