import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aventurecolombia.com",
      },
      {
        protocol: "https",
        hostname: "media-cdn.tripadvisor.com",
      },
      {
        protocol: "https",
        hostname: "www.colombiamascompetitiva.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com"
      }
    ], // agrega aquí los dominios externos que uses
  },
  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;
