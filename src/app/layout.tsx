import type { Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/i18n/LanguageContext";

// PWA Client Components
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { InstallSuccess } from "@/components/pwa/InstallSuccess";
import { UpdatePrompt } from "@/components/pwa/UpdatePrompt";
import { NetworkStatus } from "@/components/pwa/NetworkStatus";
import { OfflineQueueIndicator } from "@/components/pwa/OfflineQueueIndicator";
import { NotificationPermission } from "@/components/pwa/NotificationPermission";

// SEO
import { BASE_METADATA, organizationJsonLd, websiteJsonLd } from "@/lib/seo/metadata";
import { StructuredData } from "@/components/seo/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#f59e0b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata = BASE_METADATA;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-neutral-950 dark:text-neutral-100 font-sans transition-colors duration-300 select-none sm:select-auto"
      >
        {/* Global Structured Data (Organization + WebSite) */}
        <StructuredData data={organizationJsonLd()} />
        <StructuredData data={websiteJsonLd()} />

        <LanguageProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {/* PWA Lifecycle & Status Components */}
            <ServiceWorkerRegister />
            <NetworkStatus />
            <OfflineQueueIndicator />

            <Header />
            <main className="flex-1 pb-16">{children}</main>
            <Footer />

            {/* PWA Prompts & Notifications */}
            <InstallPrompt />
            <InstallSuccess />
            <UpdatePrompt />
            <NotificationPermission />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
