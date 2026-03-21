import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/lib/site";
import { metadataKeywords } from "./metadata";
import { SiteNav } from "@/components/site-nav";
import Footer from "@/components/footer";
import { CornerCloud } from "@/components/corner-cloud";
import "@/app/globals.css";

export const viewport: Viewport = {
  themeColor: "black",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,  
  },
  description: siteConfig.description,
  keywords: metadataKeywords,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteNav />
          {children}
          <Footer />
          <CornerCloud />
          {/* Decorative watermark */}
          <div
            className="fixed bottom-0 left-0 z-0 pointer-events-none select-none"
            aria-hidden="true"
          >
            <img
              src="/watermark.svg"
              alt=""
              className="w-[320px] md:w-[420px] h-auto opacity-[0.08] dark:opacity-[0.10] -translate-x-1/4 translate-y-1/4"
            />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
