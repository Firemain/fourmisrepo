import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  transpilePackages: ['@fourmis/ui', '@fourmis/lib', '@fourmis/types'],
};

export default withNextIntl(nextConfig);
