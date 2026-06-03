/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rensproperties.com",
      },
      {
        protocol: "https",
        hostname: "www.rensproperties.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "cloud.famproperties.com",
      },
      {
        protocol: "https",
        hostname: "cyberpedia-report-files.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "rens-uploads.s3.eu-north-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "renspro-uploads.s3.eu-north-1.amazonaws.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/buy",
        destination: "/listings?ad_type=buy",
      },
      {
        source: "/rent",
        destination: "/listings?ad_type=rent",
      },
      {
        source: "/off-plan",
        destination: "/listings?ad_type=off_plan",
      },
      {
        source: "/commercial-projects",
        destination: "/listings?top_category=commercial",
      },
    ];
  },
};

export default nextConfig;
