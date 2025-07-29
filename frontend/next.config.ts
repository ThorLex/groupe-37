import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lzdqeotoccfpwknsghmn.supabase.co',
        // Allow all paths under this hostname
        pathname: '/**', 
      },
    ],
  },
};

export default nextConfig;
