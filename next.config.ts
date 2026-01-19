import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gomagcdn.ro',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.gomagcdn.ro',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static2.evomag.ro',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.evomag.ro',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.2performant.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.profitshare.ro',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '**',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
