import { withNetlify } from '@netlify/next'

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // NO pongas `output: 'export'` si usás Server Actions
}

export default withNetlify(nextConfig)
