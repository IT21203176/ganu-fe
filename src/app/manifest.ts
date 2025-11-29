import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: 'GANU',
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#001f3d',
    theme_color: '#e69b32',
    icons: [
      {
        src: '/images/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}

