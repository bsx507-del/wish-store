import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "وِشّ | متجر الأمنيات الافتراضي",
  description: "اشترِ أمنياتك بأسعار رمزية واستمتع بلحظة الفرح. كل المنتجات افتراضية.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
