import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'neodb.social',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.doubanio.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
