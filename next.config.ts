import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 외부 이미지 도메인 허용 설정
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.ipfs.w3s.link",
      },
      {
        protocol: "https",
        hostname: "arweave.net",
      },
      {
        protocol: "https",
        hostname: "*.arweave.net",
      },
      {
        protocol: "https",
        hostname: "api.kazt.fun",
      },
    ],
  },
};

export default nextConfig;
