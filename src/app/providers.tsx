"use client";

import { PropsWithChildren, Suspense } from "react";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { usePathname, useRouter } from "next/navigation";
import useDiscoverFilters from "@/hooks/useDiscoverFilters";
import dynamic from "next/dynamic";

const DevelopmentQueryDevtools = dynamic(
  () =>
    import("@tanstack/react-query-devtools").then((module) => ({
      default: module.ReactQueryDevtools,
    })),
  { ssr: false },
);

export const queryClient = new QueryClient();

export default function Providers({ children }: PropsWithChildren) {
  const { push } = useRouter();
  const pathName = usePathname();
  const { content } = useDiscoverFilters();
  const tv = pathName.includes("/tv/") || content === "tv";

  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider navigate={push}>
        <ToastProvider
          placement="top-right"
          maxVisibleToasts={1}
          toastOffset={10}
          toastProps={{
            shouldShowTimeoutProgress: true,
            timeout: 5000,
            classNames: {
              content: "mr-7",
              closeButton:
                "opacity-100 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-auto",
            },
          }}
        />
        <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
          {/* https://github.com/vercel/next.js/discussions/61654#discussioncomment-8480088 */}
          <Suspense>
            <ProgressProvider
              options={{ showSpinner: false }}
              color={`hsl(var(--heroui-${tv ? "warning" : "primary"}))`}
            >
              {children}
            </ProgressProvider>
          </Suspense>
        </NextThemesProvider>
      </HeroUIProvider>
      {process.env.NODE_ENV !== "production" && (
        <div className="hidden md:block">
          <DevelopmentQueryDevtools initialIsOpen={false} />
        </div>
      )}
    </QueryClientProvider>
  );
}
