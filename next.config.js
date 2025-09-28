/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    optimizeCss: true,
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
}

module.exports = nextConfig
