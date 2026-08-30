/** @type {import('next').NextConfig} */
const nextConfig = {
  // The shared workspace packages ship raw TypeScript (`main: src/index.ts`)
  // rather than a build output, so Next has to compile them itself.
  transpilePackages: ['@upshot/api-client', '@upshot/types'],
  reactStrictMode: true,
};

export default nextConfig;
