import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Replacing 'domains' with 'remotePatterns' as recommended
    remotePatterns: [
      {
        protocol: "https",
        hostname: "neodesignstudio.onrender.com",
        pathname: "/uploads/**", // Matches all files under /uploads/
      },
    ],
    // Optionally, you can enable unoptimized images if necessary:
    // unoptimized: true,
  },
};

export default nextConfig;
