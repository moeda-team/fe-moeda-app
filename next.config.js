/** @type {import('next').NextConfig} */
const basePath = process.env.BASE_PATH || '';
const nextConfig = {
  env: {
    basePath
  },
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    domains: [
      'example.com',
    ]
  }
}

module.exports = nextConfig
