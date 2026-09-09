/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // Keep GitHub Pages static by default; Vercel can run server routes for payments.
  output: process.env.VERCEL ? undefined : "export",
  trailingSlash: true,
  basePath: process.env.VERCEL ? "" : "/wish-store",
  assetPrefix: process.env.VERCEL ? undefined : "/wish-store/",
};

export default nextConfig;
