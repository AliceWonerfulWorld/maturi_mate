/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  poweredByHeader: false,
  compress: true,
  swcMinify: true,
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
  },
  // Service Workerの無効化
  async rewrites() {
    return [
      {
        source: '/sw.js',
        destination: '/api/empty',
      },
    ];
  },
}

module.exports = nextConfig
