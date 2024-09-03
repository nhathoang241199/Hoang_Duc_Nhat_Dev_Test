/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://share--Publi-e28O0AIcCghh-1447109741.ap-southeast-1.elb.amazonaws.com/backend',
  },
  publicRuntimeConfig: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://share--Publi-e28O0AIcCghh-1447109741.ap-southeast-1.elb.amazonaws.com/backend',
  },
};

export default nextConfig;
