// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//  protocol: 'https',
//         hostname: 'ojass.org', // <-- Yeh domain add karein
//         port: '',
//         pathname: '/**',
// };

// export default nextConfig;
// next.config.js (ya next.config.mjs)

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ojass-2024.vercel.app', // <-- Error waala domain
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
