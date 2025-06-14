import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    //   domains: ["neodesignstudio.az"],
    //   remotePatterns: [
    //     {
    //       protocol: "https",
    //       hostname: "neodesignstudio.az",
    //       pathname: "/uploads/**",
    //     },
    //   ],
    domains: ["45.85.146.73"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "45.85.146.83",
        port: "4000",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
