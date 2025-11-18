import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // 配置图片域名
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'trae-api-sg.mchost.guru',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
