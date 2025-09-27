import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FabricsBySD - Authentic African Fabrics & Fashion",
  description: "Discover the beauty and vibrancy of African fabrics. Shop authentic Ankara and Adire prints, ready-to-wear clothing, and accessories. Bringing African fashion to the world.",
  keywords: "African fabrics, Ankara, Adire, African fashion, Nigerian textiles, African prints, ready-to-wear, accessories",
  authors: [{ name: "FabricsBySD" }],
  openGraph: {
    title: "FabricsBySD - Authentic African Fabrics & Fashion",
    description: "Discover the beauty and vibrancy of African fabrics. Shop authentic Ankara and Adire prints, ready-to-wear clothing, and accessories.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "FabricsBySD - Authentic African Fabrics & Fashion",
    description: "Discover the beauty and vibrancy of African fabrics. Shop authentic Ankara and Adire prints, ready-to-wear clothing, and accessories.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/assets/background.png" />
      </head>
      <body className={inter.className}>
        <NotificationProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </NotificationProvider>
      </body>
    </html>
  );
}