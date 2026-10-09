import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/commercial/:path*', destination: '/commerce/:path*', permanent: true },
      { source: '/hr/:path*', destination: '/human-resources/:path*', permanent: true },
      { source: '/tickets/:path*', destination: '/support/:path*', permanent: true },
      { source: '/crm', destination: '/commerce', permanent: true },
      { source: '/crm/sales', destination: '/commerce/sales', permanent: true },
      { source: '/inventory', destination: '/supply', permanent: true },
      { source: '/inventory/purchasing', destination: '/supply/purchasing', permanent: true },
      { source: '/purchases', destination: '/supply/purchasing', permanent: true },
      { source: '/sales', destination: '/commerce/sales', permanent: true },
    ];
  },
};

export default nextConfig;
