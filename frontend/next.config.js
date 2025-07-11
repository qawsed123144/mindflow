/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',  // removed to allow dynamic API routes
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // webpack: (config, { isServer }) => {
  //   config.cache = false;
  //   return config;
  // },
};

module.exports = nextConfig;