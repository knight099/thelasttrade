/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude problematic packages from Edge Runtime
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'pg-native': 'pg-native',
      });
    }
    return config;
  },
  // Disable ESLint during build to avoid stopping on warnings
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Handle server-side packages properly
  experimental: {
    serverComponentsExternalPackages: ['pg', 'bcryptjs'],
  },
};

module.exports = nextConfig;