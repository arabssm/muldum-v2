import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
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
