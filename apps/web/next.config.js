/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@focus-ar/ui',
    '@focus-ar/types',
    '@focus-ar/db',
    '@focus-ar/ai',
    '@focus-ar/cv',
  ],
  reactStrictMode: true,
};

module.exports = nextConfig;
