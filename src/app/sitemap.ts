import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/solutions/hr`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/solutions/finance`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/solutions/secretariat`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/solutions/gas`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Note: Dynamic routes (events, blogs, careers) should be fetched from API
  // and added here. For now, we're including the list pages.
  // You can enhance this by fetching dynamic content:
  
  // Example for dynamic events:
  // try {
  //   const events = await getEvents();
  //   events.forEach((event) => {
  //     staticRoutes.push({
  //       url: `${baseUrl}/events/${getEventId(event)}`,
  //       lastModified: event.updatedAt ? new Date(event.updatedAt) : new Date(event.createdAt || ''),
  //       changeFrequency: 'weekly',
  //       priority: 0.6,
  //     });
  //   });
  // } catch (error) {
  //   console.error('Error fetching events for sitemap:', error);
  // }

  return staticRoutes;
}

