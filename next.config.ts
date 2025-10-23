import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pds.joongang.co.kr',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;