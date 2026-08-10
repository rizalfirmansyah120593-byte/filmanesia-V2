import { siteConfig } from "@/config/site";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `404 Not Found | ${siteConfig.name}`,
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="absolute-center text-center">
      <h1>404</h1>
      <h4>Not Found</h4>
      <p>The page you are looking for doesn't exist.</p>
      <Link href="/" className="mt-8 inline-flex rounded-md bg-blue-600 px-6 py-2 font-bold text-white">
        Home
      </Link>
    </div>
  );
}
