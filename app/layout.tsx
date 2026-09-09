import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "وِشّ | اشترِ إحساسًا",
  description: "متجر رقمي للحظات والهدايا الخفيفة. منتجات افتراضية تُفتح فورًا.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <meta name="theme-color" content="#eff7ef" />
      </head>
      <body>{children}</body>
    </html>
  );
}
