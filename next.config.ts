import type { NextConfig } from "next";

const allowedDevOrigins = [
  "10.179.18.168",
  ...(process.env.NEXT_ALLOWED_DEV_ORIGINS
    ? process.env.NEXT_ALLOWED_DEV_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
    : []),
];

const nextConfig: NextConfig = {
  allowedDevOrigins,
};

export default nextConfig;
