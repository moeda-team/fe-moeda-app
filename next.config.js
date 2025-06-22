/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    domains: [
      'example.com',
      'moeda-space.s3.ap-southeast-1.amazonaws.com'
    ]
  }
}

module.exports = nextConfig
