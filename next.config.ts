import type { NextConfig } from "next";
import type { Configuration as WebpackConfig } from 'webpack';

const nextConfig: NextConfig = {
  images: {
    domains: ['m.media-amazon.com', 'images.shopify.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config: WebpackConfig) => {
    // Ensure module and rules exist
    if (!config.module) config.module = {};
    if (!config.module.rules) config.module.rules = [];

    // Handle markdown files
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/source',
    });

    // Handle esbuild native modules
    config.module.rules.push({
      test: /\/node_modules\/@esbuild\/.*\/README\.md$/,
      type: 'javascript/auto',
      loader: 'raw-loader',
    });

    // Ensure resolve exists
    if (!config.resolve) config.resolve = {};

    // Configure module resolution
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve?.fallback,
        fs: false,
        path: false,
        os: false,
      },
    };

    return config;
  },
};

export default nextConfig;
