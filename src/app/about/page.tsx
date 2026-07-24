import { FaGithub } from "react-icons/fa6";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { NextPage } from "next";
const FAQ = dynamic(() => import("@/components/sections/About/FAQ"));

export const metadata: Metadata = {
  title: `About | ${siteConfig.name}`,
};

const AboutPage: NextPage = () => {
  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full max-w-2xl flex-col gap-5 py-10">
        <Suspense>
          <FAQ />
        </Suspense>
        
        {/* Link Github */}
        <Link target="_blank" href={siteConfig.socials.github} className="flex justify-center mt-5">
          <FaGithub size={30} />
        </Link>

        {/* Footer Navigation */}
        <footer className="mt-10 border-t border-gray-200 pt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <Link href="/privacy" className="hover:text-blue-600 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-blue-600 transition-colors">
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:text-blue-600 transition-colors">
            Contact Us
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default AboutPage;