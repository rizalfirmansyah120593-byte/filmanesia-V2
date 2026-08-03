"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { IS_PRODUCTION } from "@/utils/constants";

const ADSTERRA_HOST = "https://alwaysmulticulturallanding.com";

const adLabelClassName = "sr-only";
const adSlotClassName =
  "w-full overflow-hidden rounded-lg border border-default-100 bg-default-50/30 p-2";

/** Loads the global Adsterra formats once, after the page becomes interactive. */
export function AdsterraGlobalScripts() {
  if (!IS_PRODUCTION) return null;

  return (
    <>
      <Script
        id="adsterra-popunder"
        strategy="lazyOnload"
        src={`${ADSTERRA_HOST}/57/e5/f7/57e5f7765523bc35cca12226e4bfd851.js`}
      />
      <Script
        id="adsterra-social-bar"
        strategy="lazyOnload"
        src={`${ADSTERRA_HOST}/6f/ff/ef/6fffef504aea7b54e2ecd13692f3cd41.js`}
      />
    </>
  );
}

export function AdsterraNativeBanner() {
  if (!IS_PRODUCTION) return null;

  return (
    <aside className={adSlotClassName} aria-label="Iklan" data-ad-slot="native-banner">
      <span className={adLabelClassName}>Iklan</span>
      <Script
        id="adsterra-native-banner"
        strategy="lazyOnload"
        async
        src={`${ADSTERRA_HOST}/a84b5b67b39cd1e8b98d8a4675095397/invoke.js`}
        data-cfasync="false"
      />
      <div id="container-a84b5b67b39cd1e8b98d8a4675095397" />
    </aside>
  );
}

function FixedSizeBanner({
  width,
  height,
  keyValue,
}: {
  width: 468 | 728;
  height: 60 | 90;
  keyValue: string;
}) {
  return (
    <aside
      className={`${adSlotClassName} flex justify-center`}
      aria-label="Iklan"
      data-ad-slot={`${width}x${height}`}
    >
      <span className={adLabelClassName}>Iklan</span>
      <div
        className="max-w-full overflow-hidden"
        style={{ width: "100%", maxWidth: width, minHeight: height }}
      >
        <Script id={`adsterra-options-${keyValue}`} strategy="lazyOnload">
          {`window.atOptions = {
            key: '${keyValue}',
            format: 'iframe',
            height: ${height},
            width: ${width},
            params: {}
          };`}
        </Script>
        <Script
          id={`adsterra-banner-${keyValue}`}
          strategy="lazyOnload"
          src={`${ADSTERRA_HOST}/${keyValue}/invoke.js`}
        />
      </div>
    </aside>
  );
}

/** Chooses the supplied 468x60 or 728x90 creative without overflowing small screens. */
export function AdsterraResponsiveBanner() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  if (!IS_PRODUCTION || isDesktop === null) return null;

  return isDesktop ? (
    <FixedSizeBanner width={728} height={90} keyValue="d0adc488978c76a7ea53444f56d70cb8" />
  ) : (
    <FixedSizeBanner width={468} height={60} keyValue="7ce1a4afe9d87e9ae5af352a18edf6d0" />
  );
}

export function AdsterraSmartlink() {
  if (!IS_PRODUCTION) return null;

  return (
    <aside className={adSlotClassName} aria-label="Sponsor">
      <span className={adLabelClassName}>Sponsor</span>
      <a
        href={`${ADSTERRA_HOST}/f12g9ctu?key=061c7594408bc94dd775b8d4148307ac`}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        className="text-foreground/70 hover:text-foreground block text-center text-sm underline decoration-dotted underline-offset-4 transition-colors"
      >
        Sponsor Filmanesia
      </a>
    </aside>
  );
}

export function AdsterraPageAds() {
  if (!IS_PRODUCTION) return null;

  return (
    <div
      className="mx-auto flex w-full max-w-5xl flex-col items-center gap-3 px-3 pt-4 pb-8 sm:px-5"
      data-ad-region
    >
      <AdsterraNativeBanner />
      <AdsterraResponsiveBanner />
      <AdsterraSmartlink />
    </div>
  );
}
