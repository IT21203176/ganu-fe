// SEO Configuration and Constants
import type { Metadata } from "next";

export const siteConfig = {
  name: "GANU Professional Services",
  description: "GANU Professional Services - Your partner in HR excellence. Leading provider of comprehensive HR, Finance, Secretariat, and General Administration solutions in Sri Lanka. Trusted by industry leaders for payroll management, EPF/ETF services, compliance, and business growth.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://ganu-fe.vercel.app",
  ogImage: "/images/logo.png",
  keywords: [
    "HR solutions",
    "Human Resources",
    "Payroll management",
    "HR compliance",
    "Finance solutions",
    "Accounting services",
    "Taxation",
    "Secretariat services",
    "Company registration",
    "Corporate compliance",
    "General administration",
    "Business services",
    "Sri Lanka",
    "Professional services",
    "HR consulting",
    "Financial consulting"
  ],
  author: "GANU Professional Services",
  locale: "en_US",
  type: "website",
};

export const defaultMetadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@ganupro", // Update with actual Twitter handle if available
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    } as const,
  } as Metadata["robots"],
  verification: {
    // Add verification codes when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
} as Metadata;

// Helper function to generate page metadata
export function generatePageMetadata(
  title: string,
  description: string,
  path: string = "/",
  image?: string,
  keywords?: string[]
): {
  title: string;
  description: string;
  alternates: { canonical: string };
  openGraph: {
    title: string;
    description: string;
    url: string;
    images: Array<{ url: string; width: number; height: number; alt: string }>;
  };
  twitter: {
    title: string;
    description: string;
    images: string[];
  };
  keywords?: string[];
} {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image || siteConfig.ogImage;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: ogImage.startsWith("http") ? ogImage : `${siteConfig.url}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      title,
      description,
      images: [ogImage.startsWith("http") ? ogImage : `${siteConfig.url}${ogImage}`],
    },
    keywords: keywords || siteConfig.keywords,
  };
}

// Structured Data (JSON-LD) helpers
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.ogImage}`,
    description: siteConfig.description,
    sameAs: [
      // Add social media links when available
      "https://www.facebook.com/Ganuhrservices",
      // "https://www.linkedin.com/company/ganupro",
      // "https://twitter.com/ganupro",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "service@ganuprofessional.lk",
      telephone: "+94-11-2563944",
      areaServed: "LK",
      availableLanguage: "en",
    },
  };
}

// Local Business Schema for better local SEO
export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}#organization`,
    name: siteConfig.name,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    url: siteConfig.url,
    telephone: "+94-11-2563944",
    email: "service@ganuprofessional.lk",
    address: {
      "@type": "PostalAddress",
      streetAddress: "No. 94/6, Hokandara East",
      addressLocality: "Hokandara",
      postalCode: "10118",
      addressCountry: "LK",
      addressRegion: "Western Province",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      opens: "09:00",
      closes: "17:00",
    },
    areaServed: {
      "@type": "Country",
      name: "Sri Lanka",
    },
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateServiceSchema(serviceName: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    description: description,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    areaServed: {
      "@type": "Country",
      name: "Sri Lanka",
    },
  };
}

export function generateArticleSchema(
  title: string,
  description: string,
  publishedDate: string,
  modifiedDate?: string,
  image?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: image ? (image.startsWith("http") ? image : `${siteConfig.url}${image}`) : `${siteConfig.url}${siteConfig.ogImage}`,
    datePublished: publishedDate,
    dateModified: modifiedDate || publishedDate,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.ogImage}`,
      },
    },
  };
}

export function generateEventSchema(
  name: string,
  description: string,
  startDate: string,
  location: string,
  image?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: name,
    description: description,
    startDate: startDate,
    location: {
      "@type": "Place",
      name: location,
    },
    image: image ? (image.startsWith("http") ? image : `${siteConfig.url}${image}`) : `${siteConfig.url}${siteConfig.ogImage}`,
    organizer: {
      "@type": "Organization",
      name: siteConfig.name,
    },
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteConfig.url}${item.url}`,
    })),
  };
}

