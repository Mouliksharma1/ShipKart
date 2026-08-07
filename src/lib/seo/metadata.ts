import type { Metadata } from "next";

const getSiteUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.startsWith("http")
      ? process.env.NEXT_PUBLIC_SITE_URL
      : `https://${process.env.NEXT_PUBLIC_SITE_URL}`;
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
};

const SITE_URL = getSiteUrl();
const SITE_NAME = "ShipKart – Powered by POOJA TRAVELS & CARGO";
const DEFAULT_DESCRIPTION =
  "Fast, Secure & Reliable Parcel, Cargo and Logistics Management Platform across Rajasthan and India. Book parcels, track consignments & manage logistics with ShipKart by POOJA TRAVELS & CARGO.";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

/**
 * Base metadata shared across all pages via the title template.
 */
export const BASE_METADATA: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "ShipKart",
    "Pooja Travels",
    "Pooja Travels & Cargo",
    "Parcel Service Rajasthan",
    "Courier Rajasthan",
    "Transport Rajasthan",
    "Cargo Service Rajasthan",
    "Logistics Rajasthan",
    "Parcel Booking Jodhpur",
    "Parcel Booking Jaipur",
    "Parcel Booking Udaipur",
    "Parcel Tracking",
    "Lorry Receipt",
    "LR Builty",
    "Cargo Booking India",
    "Online Parcel Booking",
    "Courier Service India",
  ],
  authors: [{ name: "POOJA TRAVELS & CARGO", url: SITE_URL }],
  creator: "POOJA TRAVELS & CARGO",
  publisher: "POOJA TRAVELS & CARGO",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "ShipKart – POOJA TRAVELS & CARGO Logistics Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  alternates: {
    canonical: SITE_URL,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ShipKart",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icons/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
};

/* ------------------------------------------------------------------ */
/*  Helper builders                                                    */
/* ------------------------------------------------------------------ */

interface PageMetaOptions {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
}

/**
 * Generates page-specific `Metadata` that merges with the layout template.
 */
export function generatePageMetadata({
  title,
  description,
  path = "",
  ogImage,
  noIndex = false,
}: PageMetaOptions): Metadata {
  const url = `${SITE_URL}${path}`;
  const image = ogImage || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/* ------------------------------------------------------------------ */
/*  JSON-LD Structured Data helpers                                    */
/* ------------------------------------------------------------------ */

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "POOJA TRAVELS & CARGO",
    alternateName: "ShipKart",
    url: SITE_URL,
    logo: `${SITE_URL}/shipkartLogo.png`,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+91-7852091119",
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+91-6350603414",
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    ],
    sameAs: [
      "https://wa.me/917852091119",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "45, Jaswant Building, MG Hospital Rd, Sojati Gate, Rawaton Ka Bass",
      addressLocality: "Jodhpur",
      addressRegion: "Rajasthan",
      postalCode: "342001",
      addressCountry: "IN",
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ShipKart",
    alternateName: "POOJA TRAVELS & CARGO",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/track?lr={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function localBusinessJsonLd(office: {
  name: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string;
  latitude?: number;
  longitude?: number;
  openingTime?: string;
  closingTime?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/offices#${office.name.replace(/\s+/g, "-").toLowerCase()}`,
    name: `POOJA TRAVELS & CARGO – ${office.name}`,
    telephone: office.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: office.address,
      addressLocality: office.city,
      addressRegion: office.state,
      postalCode: office.pinCode,
      addressCountry: "IN",
    },
    ...(office.latitude && office.longitude
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: office.latitude,
            longitude: office.longitude,
          },
        }
      : {}),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: office.openingTime || "04:00",
      closes: office.closingTime || "23:00",
    },
    parentOrganization: {
      "@type": "Organization",
      name: "POOJA TRAVELS & CARGO",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE };
