import type { NextConfig } from "next";

const withPWA = require('next-pwa')

const config = {
  reactStrictMode: true,
} as NextConfig;

const nextConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
})(config)

export default nextConfig
