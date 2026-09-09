import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "وِشّ | اشترِ إحساسًا",
  description: "متجر رقمي للحظات والهدايا الخفيفة. منتجات افتراضية تُفتح فورًا.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
