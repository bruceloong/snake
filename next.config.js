/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === "production" ? "/snake" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/snake/" : "",
};

module.exports = nextConfig;
