/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      // Uploaded images are served by the FastAPI backend (local + deployed).
      { protocol: "http", hostname: "localhost", port: "8000" },
      { protocol: "https", hostname: "localhost", port: "8000" },
    ],
  },
};

export default nextConfig;
