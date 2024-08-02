/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dhora.app",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // fixes: Module not found: Can’t resolve ‘../build/Release/canvas.node’
    if (isServer) {
      config.resolve.alias.canvas = false;
    }

    config.module.rules.push(
      {
        test: /\.po$/,
        use: {
          loader: "@lingui/loader",
        },
      },
      {
        test: /\.pdf$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[path][name].[ext]",
            publicPath: "/_next/static/files",
            outputPath: "static/files",
            esModule: false,
          },
        },
      }
    );

    config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");

    return config;
  },
};

export default nextConfig;
