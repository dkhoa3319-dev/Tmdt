/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/', destination: '/case-studio.html' }
    ];
  }
};
export default nextConfig;
