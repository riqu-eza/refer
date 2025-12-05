import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   experimental: {
  serverComponentsExternalPackages: ["jsonwebtoken", "bcryptjs"]
}
};

export default nextConfig;
