import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "وِشّ | متجر اللحظات الرقمية",
    short_name: "وِشّ",
    description: "تجربة ترفيهية عربية بمنتجات افتراضية وأسعار رمزية.",
    start_url: "/wish-store/",
    display: "standalone",
    dir: "rtl",
    lang: "ar",
    background_color: "#030806",
    theme_color: "#030806",
    categories: ["entertainment", "shopping"],
  };
}
