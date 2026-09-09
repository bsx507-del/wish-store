import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "وِشّ | وش نفسك تملك اليوم؟",
  description: "وِشّ متجر ترفيهي عربي لشراء لحظات ومنتجات افتراضية بأسعار رمزية. لا شحن ولا توصيل، فقط تجربة خفيفة وممتعة.",
  metadataBase: new URL("https://bsx507-del.github.io/wish-store/"),
  openGraph: {
    title: "وِشّ | وش نفسك تملك اليوم؟",
    description: "أمنيات كبيرة وأسعار صغيرة. منتجات افتراضية للمتعة فقط، بدون شحن أو توصيل.",
    url: "https://bsx507-del.github.io/wish-store/",
    siteName: "وِشّ",
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "وِشّ | متجر اللحظات الرقمية",
    description: "تجربة ترفيهية عربية بمنتجات افتراضية وأسعار رمزية.",
  },
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
