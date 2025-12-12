// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/ui/Navigation";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "My KShop",
  description: "E-commerce app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main className="pt-4 px-4">{children}</main>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
