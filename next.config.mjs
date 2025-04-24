// Importamos el módulo completo
import pkg from '@netlify/next'
const { withNetlify } = pkg

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
}

export default withNetlify(nextConfig)
