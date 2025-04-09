import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["neodesignstudio.az"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "neodesignstudio.az",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
