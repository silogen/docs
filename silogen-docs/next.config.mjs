const config = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/index.html",
      },
      {
        source: "/:path*",
        destination: "/:path*/index.html",
      },
    ];
  },
  output: "standalone",
};

export default config;
