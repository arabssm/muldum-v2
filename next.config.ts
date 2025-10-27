import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
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
