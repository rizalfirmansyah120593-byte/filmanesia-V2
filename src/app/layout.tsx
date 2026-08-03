import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import { Poppins } from "@/utils/fonts";
import "../styles/globals.css";
import "../styles/lightbox.css";
import Providers from "./providers";
import TopNavbar from "@/components/ui/layout/TopNavbar";
import BottomNavbar from "@/components/ui/layout/BottomNavbar";
import Sidebar from "@/components/ui/layout/Sidebar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { cn } from "@/utils/helpers";
import { IS_PRODUCTION, SpacingClasses } from "@/utils/constants";
import dynamic from "next/dynamic";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import { AdsterraGlobalScripts, AdsterraPageAds } from "@/components/ads/Adsterra";

const Disclaimer = dynamic(() => import("@/components/ui/overlay/Disclaimer"));

export const metadata: Metadata = {
  // Gunakan 'template' agar judul halaman bisa berubah di setiap page
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://filmanesia.com"),
  alternates: {
    canonical: "/",
  },
  applicationName: siteConfig.name,
  keywords: ["filmanesia", "film terbaru", "serial TV", "film Indonesia", "movie database"],
  authors: [{ name: "Filmanesia" }],
  creator: "Filmanesia",
  publisher: "Filmanesia",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Filmanesia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/logo.png"],
  },
  icons: { icon: "/favicon.ico", apple: "/icons/ios/180.png" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0D0C0F" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://filmanesia.com",
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${process.env.NEXT_PUBLIC_SITE_URL || "https://filmanesia.com"}/search?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
  return (
    <html suppressHydrationWarning lang="id">
      <body className={cn("bg-background min-h-dvh antialiased select-none", Poppins.className)}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {/* Pastikan tidak ada enter atau spasi di atas baris ini */}

        <Script
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtag/js?id=G-5QZ4FQ33WN"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5QZ4FQ33WN');
          `}
        </Script>
        <AdsterraGlobalScripts />

        <Suspense>
          <NuqsAdapter>
            <Providers>
              {IS_PRODUCTION && <Disclaimer />}
              <TopNavbar />
              <Sidebar>
                <div className="min-w-0 flex-1">
                  <main className={cn("container mx-auto max-w-full", SpacingClasses.main)}>
                    {children}
                  </main>
                  <AdsterraPageAds />
                </div>
              </Sidebar>
              <BottomNavbar />
            </Providers>
          </NuqsAdapter>
        </Suspense>

        {IS_PRODUCTION && (
          <>
            <SpeedInsights debug={false} />
            <Analytics debug={false} />
          </>
        )}
      </body>
    </html>
  );
}
