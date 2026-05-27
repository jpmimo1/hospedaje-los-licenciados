import withPayload from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.36"],
  transpilePackages: ["lucide-react"],
  images: {
    localPatterns: [{ pathname: "/api/media/file/**" }],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
    ],
  },

  /* config options here */
  output: "standalone", // lo activaremos cuando construyamos para producción
};

export default withPayload(nextConfig);
