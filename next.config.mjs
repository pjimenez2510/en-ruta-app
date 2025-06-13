import nextPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com",
      "cooperativasanta.ec",
      'obrogwwsrdyrqlwhhont.supabase.co',
    ],
  },
};

export default withPWA(nextConfig);
