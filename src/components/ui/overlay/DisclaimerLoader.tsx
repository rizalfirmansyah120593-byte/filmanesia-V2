"use client";

import dynamic from "next/dynamic";

const Disclaimer = dynamic(() => import("./Disclaimer"), {
  ssr: false,
  loading: () => null,
});

export default function DisclaimerLoader() {
  return <Disclaimer />;
}
